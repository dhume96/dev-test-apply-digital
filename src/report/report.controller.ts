import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common'
import { ReportService } from './report.service'
import { ReportInputDto } from '../dto/filter.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller({
  path: 'reports'
})
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('/deleted-products')
  DeletedProductsReport() {
    return this.reportService.deletedProductsReport();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/non-deleted-products')
  nonDeletedProductsReport(@Query() input: ReportInputDto) {
    return this.reportService.nonDeletedProductsReport(input);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/low-stock-products')
  nonDeletedLowStockProductsReport(@Query('stockLimit') stockLimit: number) {
    return this.reportService.lowStockProductsReport(stockLimit);
  }

}