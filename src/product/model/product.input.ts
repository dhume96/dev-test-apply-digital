import { OmitType } from '@nestjs/swagger';
import { IsString, IsNumber, IsBoolean } from 'class-validator';

export class CreateProductInput {
  @IsString()
  sku: string;

  @IsString()
  productName: string;

  @IsString()
  brand: string;

  @IsString()
  model: string;

  @IsString()
  category: string;

  @IsString()
  color: string;

  @IsNumber()
  price: number;

  @IsString()
  currency: string;

  @IsNumber()
  stock: number;
}

export class UpdateProductInput extends OmitType(CreateProductInput, [
  'sku',
] as const) {}
