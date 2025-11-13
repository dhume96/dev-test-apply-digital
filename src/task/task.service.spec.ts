import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { HttpService } from '@nestjs/axios';
import { ProductService } from '../product/product.service';
import { ConfigService } from '@nestjs/config';

describe('TaskService', () => {
  let service: TaskService;

  const mockProductService = {
    createOrUpdateProduct: jest.fn().mockResolvedValue(undefined),
  } as Partial<ProductService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        { provide: HttpService, useValue: {} },
        { provide: ProductService, useValue: mockProductService },
        { provide: ConfigService, useValue: { get: jest.fn() } },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    jest.clearAllMocks();
  });

  it('calls createOrUpdateProduct for every item in contentful-res.json', async () => {
    const file = require(process.cwd() + '/contentful-res.json');
    const expected = Array.isArray(file.items) ? file.items.length : 100;

    await service.handleCron();

    expect(mockProductService.createOrUpdateProduct).toHaveBeenCalledTimes(
      expected,
    );
  });
});
