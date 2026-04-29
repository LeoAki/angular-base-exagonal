import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Product } from '../../../domain/models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent {
  readonly products = input.required<Product[]>();
  readonly loading = input(false);
  readonly deletingId = input<number | null>(null);
  readonly errorMessage = input<string | null>(null);

  readonly refresh = output<void>();
  readonly edit = output<number>();
  readonly remove = output<number>();

  onRefresh(): void {
    this.refresh.emit();
  }

  onEdit(id: number): void {
    this.edit.emit(id);
  }

  onRemove(id: number): void {
    this.remove.emit(id);
  }
}
