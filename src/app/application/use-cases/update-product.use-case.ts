import { inject, Injectable } from '@angular/core';
import { PRODUCT_REPOSITORY } from '../ports/product-repository.token';
import { UpdateProductInput } from '../../domain/models/product.model';

@Injectable({ providedIn: 'root' })
export class UpdateProductUseCase {
  private readonly repository = inject(PRODUCT_REPOSITORY);

  execute(id: number, payload: UpdateProductInput) {
    return this.repository.update(id, payload);
  }
}
