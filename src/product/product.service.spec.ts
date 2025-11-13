import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ProductService } from './product.service';
import { Product } from './model/product.schema';

describe('ProductService', () => {
  let service: ProductService;
  let mockModel: any;

  beforeEach(async () => {
    mockModel = jest.fn();
    mockModel.findOne = jest.fn();
    mockModel.findOneAndUpdate = jest.fn();
    mockModel.find = jest.fn();
    mockModel.countDocuments = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: getModelToken(Product.name), useValue: mockModel },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('createOrUpdateProduct updates when product exists', async () => {
    const body = { sku: 'EXIST123', productName: 'Existing' } as any;
    const found = { sku: 'EXIST123' };
    const updated = { sku: 'EXIST123', productName: 'Updated' };

    mockModel.findOne.mockResolvedValue(found);
    mockModel.findOneAndUpdate.mockResolvedValue(updated);

    const result = await service.createOrUpdateProduct(body);

    expect(mockModel.findOne).toHaveBeenCalledWith({ sku: body.sku });
    expect(mockModel.findOneAndUpdate).toHaveBeenCalledWith(
      { sku: body.sku },
      body,
    );
    expect(result).toBe(updated);
  });

  it('createOrUpdateProduct creates when product does not exist', async () => {
    const body = { sku: 'NEW123', productName: 'New' } as any;
    const created = { sku: 'NEW123', productName: 'New' };

    mockModel.findOne.mockResolvedValue(null);
    mockModel.mockImplementationOnce(() => ({
      save: jest.fn().mockResolvedValue(created),
    }));

    const result = await service.createOrUpdateProduct(body);

    expect(mockModel.findOne).toHaveBeenCalledWith({ sku: body.sku });
    expect(result).toEqual(created);
  });

  it('listProducts returns paginated payload and calls countDocuments', async () => {
    const products = [{ sku: 'p1' }, { sku: 'p2' }];
    const page = 2;
    const limit = 3;

    const expectedWhere = { isDeleted: false };

    mockModel.find.mockImplementationOnce((where) => {
      expect(where).toEqual(expectedWhere);
      return {
        skip: jest
          .fn()
          .mockReturnValue({ limit: jest.fn().mockResolvedValue(products) }),
      };
    });

    mockModel.countDocuments.mockResolvedValue(42);

    const result = await service.listProducts({ page, limit } as any);

    expect(mockModel.find).toHaveBeenCalledWith(expectedWhere);
    expect(mockModel.countDocuments).toHaveBeenCalledWith(expectedWhere);
    expect(result).toEqual({
      data: products,
      total: 42,
      limit: Number(limit),
      offset: Number(page),
    });
  });

  it('deleteProduct calls findOneAndUpdate with isDeleted and deletedDate and returns the promise result', async () => {
    const sku = 'DEL123';
    const updated = { sku, isDeleted: true };

    mockModel.findOneAndUpdate.mockResolvedValue(updated);

    const result = await service.deleteProduct(sku);

    expect(mockModel.findOneAndUpdate).toHaveBeenCalledTimes(1);
    const args = mockModel.findOneAndUpdate.mock.calls[0];
    expect(args[0]).toEqual({ sku });
    expect(args[1]).toHaveProperty('isDeleted', true);
    expect(args[1]).toHaveProperty('deletedDate');
    expect(result).toBe(updated);
  });
});
