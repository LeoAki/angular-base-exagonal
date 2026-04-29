import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ProductRepositoryPort } from '../../application/ports/product-repository.port';
import { CreateProductInput, Product, UpdateProductInput } from '../../domain/models/product.model';
import {
  mapApiToProduct,
  mapCreateInputToApi,
  mapUpdateInputToApi,
  ProductApiDto
} from '../mappers/product-api.mapper';

@Injectable()
export class FakeStoreProductAdapter implements ProductRepositoryPort {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://fakestoreapi.com/products';

  list(): Observable<Product[]> {
    return this.http
      .get<ProductApiDto[]>(this.baseUrl)
      .pipe(map((items) => items.map(mapApiToProduct)));
  }

  getById(id: number): Observable<Product> {
    return this.http
      .get<ProductApiDto>(`${this.baseUrl}/${id}`)
      .pipe(map(mapApiToProduct));
  }

  create(payload: CreateProductInput): Observable<Product> {
    return this.http
      .post<ProductApiDto>(this.baseUrl, mapCreateInputToApi(payload))
      .pipe(map(mapApiToProduct));
  }

  update(id: number, payload: UpdateProductInput): Observable<Product> {
    return this.http
      .put<ProductApiDto>(`${this.baseUrl}/${id}`, mapUpdateInputToApi(payload))
      .pipe(map(mapApiToProduct));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
