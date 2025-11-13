import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductListInputDto } from '../dto/filter.dto';

describe('ProductController', () => {
  let controller: ProductController;

  const mockService = {
    listProducts: jest.fn().mockResolvedValue([{ sku: 'sku1' }]),
    deleteProduct: jest
      .fn()
      .mockResolvedValue({ sku: 'sku1', isDeleted: true }),
  } as Partial<ProductService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [{ provide: ProductService, useValue: mockService }],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    jest.clearAllMocks();
  });

  it('calls listProducts with the query and returns result', async () => {
    const dto: ProductListInputDto = { page: 1, limit: 5 } as any;

    const result = await controller.listProduct(dto as any);

    expect(mockService.listProducts).toHaveBeenCalledWith(dto);
    expect(result).toEqual([{ sku: 'sku1' }]);
  });

  it('calls deleteProduct with sku and returns result', async () => {
    const sku = 'ABC123';

    const result = await controller.deleteProduct(sku);

    expect(mockService.deleteProduct).toHaveBeenCalledWith(sku);
    expect(result).toEqual({ sku: 'sku1', isDeleted: true });
  });
});
