import {Component, inject, Input} from "@angular/core";
import {CommonModule} from "@angular/common";
import {Product} from "../../../products/data-access/product.model";
import {CartsService} from "../../data-access/carts.service";
import {Button} from "primeng/button";
import {InputNumberModule} from "primeng/inputnumber";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-cart-controls',
  standalone: true,
  imports: [CommonModule, Button, InputNumberModule, FormsModule],
  templateUrl: "./cart-controls.component.html",
  styleUrls: ["./cart-controls.component.scss"],
})
export class CartControlsComponent {
  @Input() product!: Product;

  private readonly cartService = inject(CartsService);

  get cartItem() {
    return this.cartService.items().find(item => item.product.id === this.product.id);
  }

  add() {
    this.cartService.add(this.product);
  }

  remove() {
    if (this.cartItem) {
      this.cartService.remove(this.cartItem.product);
    }
  }

  updateQuantity(quantity: number) {
    if (!this.cartItem) return;
    if (quantity > 0) {
      this.cartService.updateQuantity(this.cartItem.product, quantity);
    } else {
      this.remove();
    }
  }
}