import { Routes } from '@angular/router';
import { ProductsPage } from './ui/pages/products/products.page';

export const routes: Routes = [
  {
    path: '',
    component: ProductsPage
  },
  {
    path: '**',
    redirectTo: ''
  }
];
