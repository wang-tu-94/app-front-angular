import {Component, inject, input, Input, InputSignal, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import {Product} from "../../../products/data-access/product.model";
import {CartsService} from "../../data-access/carts.service";
import {Button} from "primeng/button";
import {InputNumberModule} from "primeng/inputnumber";
import {FormsModule} from "@angular/forms";

@Component({
    selector: 'app-cart-controls',
    imports: [CommonModule, Button, InputNumberModule, FormsModule],
    templateUrl: "./cart-controls.component.html",
    styleUrls: ["./cart-controls.component.scss"]
})
export class CartControlsComponent implements OnInit {
  product = input<Product>({})

  private readonly cartService = inject(CartsService);
  public readonly cart = this.cartService.cart;

  ngOnInit(): void {
  }

  get cartItem() {
    return this.cart().items.find(item => item?.product?.id === this.product().id);
  }

  add() {
    this.cartService.add(this.product()).subscribe();
  }

  remove() {
    console.log(`cartId : ${this.cartItem?.id}`)
    this.cartService.remove(this.cartItem?.id, this.product()).subscribe();
  }

  updateQuantity(quantity: number) {
    if (!this.cartItem) return;
    if (quantity > 0) {
      this.cartService.updateQuantity(this.product(), quantity);
    } else {
      this.remove();
    }
  }
}
