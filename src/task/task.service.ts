import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ProductService } from '../product/product.service';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly productService: ProductService,
    private configService: ConfigService,
  ) {}

  // @Cron('0 * * * *')
  @Cron('* * * * *')
  async handleCron() {
    this.logger.log('Getting products from Contentful');

    // Contentful API call
    // const res = await firstValueFrom(this.httpService.get(this.getContentfulUri()));

    const YAML_CONFIG_FILENAME = 'contentful-res.json';
    const configPath = join(process.cwd(), YAML_CONFIG_FILENAME);
    const fileContent = readFileSync(configPath, 'utf8');

    // Use contentful response
    // const filteredItems = res.data.items.map((item) => {
    const filteredItems = JSON.parse(fileContent).items.map((item) => {
      const newItem = { ...item.fields, productName: item.fields.name };
      delete newItem.name;
      return newItem;
    });

    for (const product of filteredItems) {
      try {
        await this.productService.createOrUpdateProduct(product);
      } catch (error) {
        this.logger.error(`Failed to process SKU: ${product.sku}`);
        this.logger.error(error);
      }
    }

    this.logger.log('Finished creating/updating the products in the DB');
  }

  getContentfulUri() {
    const baseUri = this.configService.get<string>('CONTENTFUL_BASE_URI');
    const spaceId = this.configService.get<string>('CONTENTFUL_SPACE_ID');
    const accessToken = this.configService.get<string>(
      'CONTENTFUL_ACCESS_TOKEN',
    );
    const environment = this.configService.get<string>(
      'CONTENTFUL_ENVIRONMENT',
    );
    const contentType = this.configService.get<string>(
      'CONTENTFUL_CONTENT_TYPE',
    );

    return `${baseUri}spaces/${spaceId}/environments/${environment}/entries?access_token=${accessToken}&content_type=${contentType}`;
  }
}
