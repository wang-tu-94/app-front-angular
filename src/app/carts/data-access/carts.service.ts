import {Injectable, signal, computed, inject} from '@angular/core';
import {Cart, CartItem} from "./cart.model";
import {Product} from "../../products/data-access/product.model";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable, tap} from "rxjs";

@Injectable({providedIn: 'root'})
export class CartsService {
  private readonly http = inject(HttpClient);
  private readonly path = "/api/v1/carts";
  private readonly API_URL = environment.apiUrl;

  private readonly _cart = signal<Cart>({items: []});
  public readonly cart = this._cart.asReadonly();

  public get() {
    this.http.get<Cart>(`${this.API_URL}${this.path}`).subscribe(res => {
      this._cart.set(res);
    });
  }

  add(product: Product, quantity = 1) {
    const cart = {...this._cart()};
    const existing = cart.items.find(item => item.productId === product.id);
    if (existing) {
      existing.quantity += quantity;
      return this.updateQuantity(product, existing.quantity);
    } else {
      const cartItem = {
        productId: product.id,
        productName: product.name,
        unitPrice: product.price,
        quantity: quantity
      }

      return this.http.post<Cart>(`${this.API_URL}${this.path}/${cart.id}/items`, cartItem).pipe(
        tap(res => this._cart.set(res))
      )
    }
  }

  remove(cartItemId?: number, product?: Product) {
    const cartItemKey = cartItemId || (this.findCartItemByProductId(product?.id)?.id)
    console.log("cartItemKey", cartItemKey)
    return this.http.delete<Cart>(`${this.API_URL}${this.path}/${this.cart().id}/items/${cartItemKey}`).pipe(
      tap(res => this._cart.set(res))
    )
  }

  updateQuantity(product: Product, quantity: number) {
    const cart = {...this._cart()};
    const existing = this.findCartItemByProductId(product.id)!;
    existing.quantity = quantity;
    return this.http.patch<Cart>(`${this.API_URL}${this.path}/${cart.id}/items/${existing.id}`, {quantity: quantity})
      .pipe(tap(res => this._cart.set(res)))
  }

  private findCartItemByProductId(productId?: number): CartItem | undefined {
    if (!productId) {
      return undefined;
    }

    const cart = {...this._cart()};
    return cart.items.find(item => item.productId === productId);
  }

  clear(cartId: number) {
    return this.http.delete<Cart>(`${this.API_URL}${this.path}/${cartId}`).pipe(
      tap(res => this._cart.set(res))
    )
  }
}
