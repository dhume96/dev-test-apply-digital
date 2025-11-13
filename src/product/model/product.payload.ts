import { PartialType } from '@nestjs/swagger'
import { Product } from './product.schema'

export class ProductPayload extends PartialType(Product) {
  createdA?: string
  updateAt?: string
}