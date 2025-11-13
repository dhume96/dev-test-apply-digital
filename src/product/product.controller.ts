import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { CreateProductInput } from './model/product.input'
import { ProductService } from './product.service'
import { ProductListInputDto } from '../dto/filter.dto';

@Controller({
  path: 'products'
})
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('/list')
  listProduct(@Query() queryInput: ProductListInputDto) {
    return this.productService.listProducts(queryInput);
  }

  @Delete('/:sku')
  deleteProduct(@Param('sku') sku: string) {
    return this.productService.deleteProduct(sku);
  }
}