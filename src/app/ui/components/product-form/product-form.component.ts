import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  output,
  signal
} from '@angular/core';
import {
  Field,
  FormField,
  form,
  min,
  minLength,
  required,
  submit
} from '@angular/forms/signals';
import { CreateProductInput } from '../../../domain/models/product.model';

type FormMode = 'create' | 'edit';

const createEmptyProductInput = (): CreateProductInput => ({
  name: '',
  price: 0,
  description: '',
  image: ''
});

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [FormField],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductFormComponent {
  readonly value = input<CreateProductInput>(createEmptyProductInput());
  readonly mode = input<FormMode>('create');
  readonly submitting = input(false);

  readonly formSubmit = output<CreateProductInput>();
  readonly cancel = output<void>();

  private readonly model = signal<CreateProductInput>(createEmptyProductInput());

  readonly productForm = form(this.model, (root) => {
    required(root.name, { message: 'El nombre es obligatorio.' });
    minLength(root.name, 3, { message: 'El nombre debe tener al menos 3 caracteres.' });

    required(root.price, { message: 'El precio es obligatorio.' });
    min(root.price, 0.01, { message: 'El precio debe ser mayor o igual a 0.01.' });

    required(root.description, { message: 'La descripción es obligatoria.' });
    minLength(root.description, 10, {
      message: 'La descripción debe tener al menos 10 caracteres.'
    });

    required(root.image, { message: 'La URL de imagen es obligatoria.' });
  });

  constructor() {
    effect(() => {
      this.productForm().reset({ ...this.value() });
    });
  }

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();

    await submit(this.productForm, async (formState) => {
      this.formSubmit.emit(formState().value());
      return undefined;
    });
  }

  onCancel(): void {
    this.cancel.emit();
  }

  showError(field: Field<unknown>): boolean {
    const state = field();
    return state.invalid() && (state.touched() || state.dirty());
  }

  errorMessage(field: Field<unknown>): string | null {
    if (!this.showError(field)) {
      return null;
    }

    const firstError = field().errors()[0];
    if (!firstError) {
      return null;
    }

    if (firstError.message) {
      return firstError.message;
    }

    if (firstError.kind === 'required') {
      return 'Este campo es obligatorio.';
    }

    if (firstError.kind === 'min') {
      return 'El valor es menor al permitido.';
    }

    if (firstError.kind === 'minlength') {
      return 'El texto es más corto de lo permitido.';
    }

    return 'Campo inválido.';
  }
}
