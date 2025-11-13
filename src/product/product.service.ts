import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './model/product.schema';
import { Model } from 'mongoose';
import { CreateProductInput } from './model/product.input';
import { ProductPayload } from './model/product.payload';
import { ProductListInputDto } from 'src/dto/filter.dto';
import { PaginationPayload } from './model/pagination.payload';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);
  constructor(
    @InjectModel(Product.name) private ProductModel: Model<Product>,
  ) {}

  async createOrUpdateProduct(
    body: CreateProductInput,
  ): Promise<ProductPayload | null> {
    const foundProduct = await this.ProductModel.findOne({ sku: body.sku });
    if (foundProduct) {
      const updatedProduct = await this.ProductModel.findOneAndUpdate(
        { sku: body.sku },
        body,
      );
      this.logger.log(`Updated SKU: ${updatedProduct?.sku}`);
      return updatedProduct;
    } else {
      const product = new this.ProductModel(body);
      const createdProduct = await product.save();
      this.logger.log(`Created SKU: ${createdProduct?.sku}`);
      return createdProduct;
    }
  }

  async listProducts(input: ProductListInputDto): Promise<PaginationPayload> {
    const { page = 1, limit = 5, name, category, priceMin, priceMax } = input;
    const skip = (page - 1) * limit;

    const where: any = { isDeleted: false };
    if (name) where.productName = { $regex: '.*' + name + '.*' };
    if (category) where.category = { $regex: '.*' + category + '.*' };
    if (priceMin && priceMax) {
      where.price = {
        $lte: priceMax,
        $gte: priceMin,
      };
    }

    const Products = await this.ProductModel.find(where)
      .skip(skip)
      .limit(limit);
    const total = await this.ProductModel.countDocuments(where);
    return {
      data: Products,
      total,
      limit: Number(limit),
      offset: Number(page),
    };
  }

  async deleteProduct(sku: string): Promise<ProductPayload | null> {
    const updatedProduct = this.ProductModel.findOneAndUpdate(
      { sku },
      { isDeleted: true, deletedDate: new Date() },
    );
    return updatedProduct;
  }
}
