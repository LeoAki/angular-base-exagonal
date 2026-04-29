import { InjectionToken } from '@angular/core';
import { ProductRepositoryPort } from './product-repository.port';

export const PRODUCT_REPOSITORY = new InjectionToken<ProductRepositoryPort>('PRODUCT_REPOSITORY');
