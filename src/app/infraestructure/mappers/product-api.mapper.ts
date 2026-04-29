import { CreateProductInput, Product, UpdateProductInput } from '../../domain/models/product.model';

export interface ProductApiDto {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
}

export const mapApiToProduct = (dto: ProductApiDto): Product => ({
  id: dto.id,
  name: dto.title,
  price: dto.price,
  description: dto.description,
  image: dto.image
});

export const mapCreateInputToApi = (payload: CreateProductInput) => ({
  title: payload.name,
  price: payload.price,
  description: payload.description,
  image: payload.image
});

type ProductApiUpdatePayload = {
  title?: string;
  price?: number;
  description?: string;
  image?: string;
};

export const mapUpdateInputToApi = (payload: UpdateProductInput) => {
  const apiPayload: ProductApiUpdatePayload = {};

  if (payload.name !== undefined) apiPayload.title = payload.name;
  if (payload.price !== undefined) apiPayload.price = payload.price;
  if (payload.description !== undefined) apiPayload.description = payload.description;
  if (payload.image !== undefined) apiPayload.image = payload.image;

  return apiPayload;
};
