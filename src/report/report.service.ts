import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from '../product/model/product.schema';
import { Model } from 'mongoose';
import { ProductPayload } from '../product/model/product.payload';
import { ReportInputDto } from '../dto/filter.dto';

@Injectable()
export class ReportService {
  private readonly logger = new Logger(ReportService.name);
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async deletedProductsReport(): Promise<any> {
    const productsTotalCount = await this.productModel.countDocuments();
    const deletedProductsCount = await this.productModel.countDocuments({
      isDeleted: true,
    });

    const report = {
      deletedProductsPercentage:
        (deletedProductsCount / productsTotalCount) * 100,
    };

    return report;
  }

  async nonDeletedProductsReport(
    input: ReportInputDto,
  ): Promise<ProductPayload[]> {
    // const { dateFrom, dateTo } = input;
    console.log(input);

    const where: any = { isDeleted: false };

    const Reports = await this.productModel.find(where);
    return Reports;
  }

  async lowStockProductsReport(stockLimit: number): Promise<any> {
    const productsCount = await this.productModel.countDocuments({
      isDeleted: false,
      stock: { $lte: stockLimit },
    });

    const report = {
      nonDeletedLowStockProductsCount: productsCount,
      stockLimit,
    };

    return report;
  }
}
