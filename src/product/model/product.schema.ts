import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type ProductDocument = HydratedDocument<Product>

@Schema({ collection: 'products', timestamps: true })
export class Product {
  @Prop()
  sku: string

  @Prop()
  productName: string

  @Prop()
  brand: string

  @Prop()
  model: string

  @Prop()
  category: string

  @Prop()
  color: string

  @Prop()
  price: number

  @Prop()
  currency: string

  @Prop()
  stock: number

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean

  @Prop()
  deletedDate: Date
}

export const ProductSchema = SchemaFactory.createForClass(Product)