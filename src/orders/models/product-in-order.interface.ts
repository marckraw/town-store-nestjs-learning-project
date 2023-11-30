import { Product } from '../../products/products/product.interface';

export interface ProductInOrder {
  id: number;
  productId: Product['id'];
  quantity: number;
}
