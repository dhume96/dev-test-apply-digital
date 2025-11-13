import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { CreateProductInput } from './model/product.input'
import { ProductService } from './product.service'
import { ProductListInputDto } from '../dto/filter.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller({
  path: 'products'
})
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('/list')
  @ApiOperation({ summary: 'List products' })
  @ApiResponse({ status: 200, description: 'List of non deleted products filtered based on the received parameters' })
  listProduct(@Query() queryInput: ProductListInputDto) {
    return this.productService.listProducts(queryInput);
  }

  @Delete('/:sku')
  @ApiOperation({ summary: 'Delete product' })
  @ApiResponse({ status: 200, description: 'Product isDeleted marked as true' })
  deleteProduct(@Param('sku') sku: string) {
    return this.productService.deleteProduct(sku);
  }
}