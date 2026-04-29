export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
}

export type CreateProductInput = Omit<Product, 'id'>;
export type UpdateProductInput = Partial<CreateProductInput>;
