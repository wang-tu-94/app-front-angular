import {Product} from "../../products/data-access/product.model";

export interface Cart {
  id?: number;
  items: CartItem[];
  total?: number;
}

export interface CartItem {
  id?: number;
  productId?: number;
  productName?: string;
  unitPrice?: number;
  quantity: number;
  product?: Product;
  total?: number;
}
