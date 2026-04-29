import { inject, Injectable } from '@angular/core';
import { PRODUCT_REPOSITORY } from '../ports/product-repository.token';

@Injectable({ providedIn: 'root' })
export class ListProductsUseCase {
  private readonly repository = inject(PRODUCT_REPOSITORY);

  execute() {
    return this.repository.list();
  }
}
