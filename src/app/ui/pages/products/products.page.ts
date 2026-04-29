import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CreateProductUseCase } from '../../../application/use-cases/create-product.use-case';
import { DeleteProductUseCase } from '../../../application/use-cases/delete-product.use-case';
import { GetProductByIdUseCase } from '../../../application/use-cases/get-product-by-id.use-case';
import { ListProductsUseCase } from '../../../application/use-cases/list-products.use-case';
import { UpdateProductUseCase } from '../../../application/use-cases/update-product.use-case';
import { CreateProductInput, Product } from '../../../domain/models/product.model';
import { ProductFormComponent } from '../../components/product-form/product-form.component';
import { ProductListComponent } from '../../components/product-list/product-list.component';

type FormMode = 'create' | 'edit';
const createEmptyDraft = (): CreateProductInput => ({
  name: '',
  price: 0,
  description: '',
  image: ''
});

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [ProductFormComponent, ProductListComponent],
  templateUrl: './products.page.html',
  styleUrl: './products.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsPage {
  private readonly destroyRef = inject(DestroyRef);
  private readonly listProductsUseCase = inject(ListProductsUseCase);
  private readonly getProductByIdUseCase = inject(GetProductByIdUseCase);
  private readonly createProductUseCase = inject(CreateProductUseCase);
  private readonly updateProductUseCase = inject(UpdateProductUseCase);
  private readonly deleteProductUseCase = inject(DeleteProductUseCase);

  readonly products = signal<Product[]>([]);
  readonly loading = signal(false);
  readonly submitting = signal(false);
  readonly deletingId = signal<number | null>(null);
  readonly errorMessage = signal<string | null>(null);
  readonly mode = signal<FormMode>('create');
  readonly selectedId = signal<number | null>(null);
  readonly draft = signal<CreateProductInput>(createEmptyDraft());

  readonly sortedProducts = computed(() =>
    [...this.products()].sort((a, b) => a.id - b.id)
  );

  constructor() {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.listProductsUseCase
      .execute()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (items) => {
          this.products.set(items);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.errorMessage.set('No se pudo cargar la lista de productos.');
        }
      });
  }

  submit(payload: CreateProductInput): void {
    const normalizedPayload: CreateProductInput = {
      name: payload.name.trim(),
      price: payload.price,
      description: payload.description.trim(),
      image: payload.image.trim()
    };

    if (!normalizedPayload.name || !normalizedPayload.description || !normalizedPayload.image) {
      this.errorMessage.set('Completa todos los campos obligatorios.');
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set(null);

    if (this.mode() === 'create') {
      this.createProduct(normalizedPayload);
      return;
    }

    const id = this.selectedId();
    if (id === null) {
      this.submitting.set(false);
      this.errorMessage.set('No se encontró el producto para editar.');
      return;
    }

    this.updateProduct(id, normalizedPayload);
  }

  edit(id: number): void {
    this.mode.set('edit');
    this.selectedId.set(id);
    this.errorMessage.set(null);

    this.getProductByIdUseCase
      .execute(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (product) => {
          this.draft.set({
            name: product.name,
            price: product.price,
            description: product.description,
            image: product.image
          });
        },
        error: () => {
          this.errorMessage.set('No se pudo obtener el detalle del producto.');
        }
      });
  }

  remove(id: number): void {
    this.deletingId.set(id);
    this.errorMessage.set(null);

    this.deleteProductUseCase
      .execute(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.products.update((items) => items.filter((item) => item.id !== id));
          if (this.selectedId() === id) {
            this.cancelEdit();
          }
          this.deletingId.set(null);
        },
        error: () => {
          this.deletingId.set(null);
          this.errorMessage.set('No se pudo eliminar el producto.');
        }
      });
  }

  cancelEdit(): void {
    this.mode.set('create');
    this.selectedId.set(null);
    this.draft.set(createEmptyDraft());
  }

  private createProduct(payload: CreateProductInput): void {
    this.createProductUseCase
      .execute(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (product) => {
          this.products.update((items) => [product, ...items]);
          this.submitting.set(false);
          this.draft.set(createEmptyDraft());
        },
        error: () => {
          this.submitting.set(false);
          this.errorMessage.set('No se pudo crear el producto.');
        }
      });
  }

  private updateProduct(id: number, payload: CreateProductInput): void {
    this.updateProductUseCase
      .execute(id, payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (product) => {
          this.products.update((items) =>
            items.map((item) => (item.id === id ? product : item))
          );
          this.submitting.set(false);
          this.cancelEdit();
        },
        error: () => {
          this.submitting.set(false);
          this.errorMessage.set('No se pudo actualizar el producto.');
        }
      });
  }
}
