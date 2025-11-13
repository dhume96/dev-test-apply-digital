import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ReportService } from './report.service';
import { Product } from '../product/model/product.schema';

describe('ReportService', () => {
  let service: ReportService;
  let mockModel: any;

  beforeEach(async () => {
    mockModel = {
      countDocuments: jest.fn(),
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportService,
        { provide: getModelToken(Product.name), useValue: mockModel },
      ],
    }).compile();

    service = module.get<ReportService>(ReportService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('deletedProductsReport', () => {
    it('calculates deleted products percentage correctly', async () => {
      const totalCount = 100;
      const deletedCount = 25;

      mockModel.countDocuments
        .mockResolvedValueOnce(totalCount)
        .mockResolvedValueOnce(deletedCount);

      const result = await service.deletedProductsReport();

      expect(mockModel.countDocuments).toHaveBeenCalledTimes(2);
      expect(mockModel.countDocuments).toHaveBeenNthCalledWith(1);
      expect(mockModel.countDocuments).toHaveBeenNthCalledWith(2, {
        isDeleted: true,
      });
      expect(result.deletedProductsPercentage).toBe(25);
    });

    it('handles zero total products', async () => {
      mockModel.countDocuments
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0);

      const result = await service.deletedProductsReport();

      expect(result.deletedProductsPercentage).toBe(NaN);
    });
  });

  describe('nonDeletedProductsReport', () => {
    it('returns non-deleted products', async () => {
      const products = [
        { sku: 'sku1', isDeleted: false },
        { sku: 'sku2', isDeleted: false },
      ];
      mockModel.find.mockResolvedValue(products);

      const input = { dateFrom: '2024-01-01', dateTo: '2024-12-31' };
      const result = await service.nonDeletedProductsReport(input as any);

      expect(mockModel.find).toHaveBeenCalledWith({ isDeleted: false });
      expect(result).toEqual(products);
    });

    it('ignores dateFrom and dateTo in query (currently not used)', async () => {
      const products: any[] = [];
      mockModel.find.mockResolvedValue(products);

      const input = { dateFrom: '2024-01-01', dateTo: '2024-12-31' };
      await service.nonDeletedProductsReport(input as any);

      // Verify the query doesn't include dateFrom/dateTo
      expect(mockModel.find).toHaveBeenCalledWith({ isDeleted: false });
    });
  });

  describe('lowStockProductsReport', () => {
    it('counts products with stock below limit', async () => {
      const stockLimit = 10;
      const productsCount = 5;

      mockModel.countDocuments.mockResolvedValue(productsCount);

      const result = await service.lowStockProductsReport(stockLimit);

      expect(mockModel.countDocuments).toHaveBeenCalledWith({
        isDeleted: false,
        stock: { $lte: stockLimit },
      });
      expect(result.nonDeletedLowStockProductsCount).toBe(productsCount);
      expect(result.stockLimit).toBe(stockLimit);
    });

    it('returns zero count when no low stock products', async () => {
      const stockLimit = 100;
      mockModel.countDocuments.mockResolvedValue(0);

      const result = await service.lowStockProductsReport(stockLimit);

      expect(result.nonDeletedLowStockProductsCount).toBe(0);
      expect(result.stockLimit).toBe(stockLimit);
    });

    it('includes only non-deleted products in count', async () => {
      const stockLimit = 5;
      mockModel.countDocuments.mockResolvedValue(3);

      await service.lowStockProductsReport(stockLimit);

      // Verify isDeleted: false is included in the query
      const callArgs = mockModel.countDocuments.mock.calls[0][0];
      expect(callArgs).toHaveProperty('isDeleted', false);
      expect(callArgs).toHaveProperty('stock', { $lte: stockLimit });
    });
  });
});
