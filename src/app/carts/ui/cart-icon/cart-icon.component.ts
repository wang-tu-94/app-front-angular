import {Component, inject, OnInit} from "@angular/core";
import {CartsService} from "../../data-access/carts.service";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-cart-icon',
  templateUrl: "./cart-icon.component.html",
  styleUrls: ["./cart-icon.component.scss"],
  standalone: true,
  imports: [
    RouterLink
  ]
})
export class CartIconComponent {
    public readonly cartService = inject(CartsService);
    public readonly cart = this.cartService.cart;
}
