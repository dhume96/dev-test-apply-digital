import { IsNumber, IsOptional, IsPositive, IsString, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ProductListInputDto {
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    @ApiProperty()
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    @Max(5)
    @ApiProperty()
    limit?: number = 5;

    @IsOptional()
    @Type(() => String)
    @IsString()
    @ApiProperty()
    name?: string;

    @IsOptional()
    @Type(() => String)
    @IsString()
    @ApiProperty()
    category?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @ApiProperty()
    priceMin?: number = 0;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    @ApiProperty()
    priceMax?: number = 1000;
}

export class ReportInputDto {
    @IsOptional()
    @Type(() => String)
    @IsString()
    @ApiProperty()
    dateFrom?: string;

    @IsOptional()
    @Type(() => String)
    @IsString()
    @ApiProperty()
    dateTo?: string;
}

export class TokenInputDto {
    @Type(() => String)
    @IsString()
    @ApiProperty()
    username?: string;
}