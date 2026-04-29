import { Provider } from '@angular/core';
import { PRODUCT_REPOSITORY } from '../../application/ports/product-repository.token';
import { FakeStoreProductAdapter } from '../adapters/fake-store-product.adapter';

export const PRODUCT_PROVIDERS: Provider[] = [
  FakeStoreProductAdapter,
  {
    provide: PRODUCT_REPOSITORY,
    useExisting: FakeStoreProductAdapter
  }
];
