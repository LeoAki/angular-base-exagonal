import { inject, Injectable } from '@angular/core';
import { PRODUCT_REPOSITORY } from '../ports/product-repository.token';

@Injectable({ providedIn: 'root' })
export class DeleteProductUseCase {
  private readonly repository = inject(PRODUCT_REPOSITORY);

  execute(id: number) {
    return this.repository.delete(id);
  }
}
