import { ProductPayload } from './product.payload';

export class PaginationPayload extends ProductPayload {
  data: ProductPayload[];
  total: number;
  limit: number;
  offset: number;
}
