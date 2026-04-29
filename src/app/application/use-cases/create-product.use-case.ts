import { inject, Injectable } from '@angular/core';
import { PRODUCT_REPOSITORY } from '../ports/product-repository.token';
import { CreateProductInput } from '../../domain/models/product.model';

@Injectable({ providedIn: 'root' })
export class CreateProductUseCase {
  private readonly repository = inject(PRODUCT_REPOSITORY);

  execute(payload: CreateProductInput) {
    return this.repository.create(payload);
  }
}
