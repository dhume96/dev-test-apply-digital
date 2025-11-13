import { Module } from '@nestjs/common';
import { ProductService } from '../product/product.service';
import { ReportController } from './report.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from '../product/model/product.schema';
import { ReportService } from './report.service';
import { JwtStrategy } from '../auth/jwt.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  providers: [ProductService, ReportService, JwtStrategy],
  controllers: [ReportController],
  exports: [ProductService, ReportService],
})
export class ReportModule {}
