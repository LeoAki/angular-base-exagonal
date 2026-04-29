import { Observable } from 'rxjs';
import { CreateProductInput, Product, UpdateProductInput } from '../../domain/models/product.model';

export interface ProductRepositoryPort {
  list(): Observable<Product[]>;
  getById(id: number): Observable<Product>;
  create(payload: CreateProductInput): Observable<Product>;
  update(id: number, payload: UpdateProductInput): Observable<Product>;
  delete(id: number): Observable<void>;
}
