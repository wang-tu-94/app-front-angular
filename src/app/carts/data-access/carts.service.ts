import { Injectable, signal, computed } from '@angular/core';
import {Cart} from "./cart.model";
import {Product} from "../../products/data-access/product.model";

@Injectable({ providedIn: 'root' })
export class CartsService {
    private _cart = signal<Cart>({ items: [] });

    readonly items = computed(() => this._cart().items);

    readonly itemCount = computed(() =>
        this._cart().items.reduce((count, item) => count + item.quantity, 0)
    );

    add(product: Product, quantity = 1) {
        const cart = { ...this._cart() };
        const existing = cart.items.find(item => item.product.id === product.id);
        if (existing) {
            existing.quantity += quantity;
        } else {
            cart.items.push({ product, quantity });
        }
        this._cart.set(cart);
    }

    remove(product: Product) {
        const cart = { ...this._cart() };
        cart.items = cart.items.filter(item => item.product.id !== product.id);
        this._cart.set(cart);
    }

    updateQuantity(product: Product, quantity: number) {
        const cart = { ...this._cart() };
        const existing = cart.items.find(item => item.product.id === product.id);
        if (existing) {
            existing.quantity = quantity;
            this._cart.set(cart);
        }
    }

    clear() {
        this._cart.set({ items: [] });
    }
}
