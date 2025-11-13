import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportInputDto } from '../dto/filter.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller({
  path: 'reports',
})
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('/deleted-products')
  @ApiOperation({ summary: 'Deleted products report' })
  @ApiResponse({
    status: 200,
    description: 'Return the report with the percentage of deleted products',
  })
  DeletedProductsReport() {
    return this.reportService.deletedProductsReport();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/non-deleted-products')
  @ApiOperation({ summary: 'Non-deleted products report' })
  @ApiResponse({
    status: 200,
    description: 'Return the report of non deleted products',
  })
  nonDeletedProductsReport(@Query() input: ReportInputDto) {
    return this.reportService.nonDeletedProductsReport(input);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/low-stock-products')
  @ApiOperation({ summary: 'Low stock products report' })
  @ApiResponse({
    status: 200,
    description:
      'Return the report of products with low stock based on the received stock limit',
  })
  nonDeletedLowStockProductsReport(@Query('stockLimit') stockLimit: number) {
    return this.reportService.lowStockProductsReport(stockLimit);
  }
}
