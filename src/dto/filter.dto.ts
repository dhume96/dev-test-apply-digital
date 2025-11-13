import { IsNumber, IsOptional, IsPositive, IsString, Max } from 'class-validator';
import { Type } from 'class-transformer';

class PriceRange {
    min: number;
    max: number;
}

export class ProductListInputDto {
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    @Max(5)
    limit?: number = 5;

    @IsOptional()
    @Type(() => String)
    @IsString()
    name?: string;

    @IsOptional()
    @Type(() => String)
    @IsString()
    category?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    priceMin?: number = 0;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    priceMax?: number = 1000;
}

export class ReportInputDto {
    @IsOptional()
    @Type(() => String)
    @IsString()
    dateFrom?: string;

    @IsOptional()
    @Type(() => String)
    @IsString()
    dateTo?: string;
}