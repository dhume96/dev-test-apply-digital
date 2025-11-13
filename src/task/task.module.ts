import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [ScheduleModule.forRoot(), HttpModule, ProductModule],
  providers: [TaskService],
})
export class TaskModule {}
