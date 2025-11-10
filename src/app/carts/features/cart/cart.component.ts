import {Component, inject} from "@angular/core";
import {CommonModule} from "@angular/common";
import {InputNumberModule} from "primeng/inputnumber";
import {FormsModule} from "@angular/forms";
import {DataViewModule} from "primeng/dataview";
import {CardModule} from "primeng/card";
import {CartControlsComponent} from "../../ui/cart-controls/cart-controls.component";
import {CartsService} from "../../data-access/carts.service";
import {Button} from "primeng/button";
import {TagModule} from "primeng/tag";

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, InputNumberModule, FormsModule, DataViewModule, CardModule, CartControlsComponent, Button, TagModule],
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.scss"],
})
export class CartComponent {
  private readonly cartsService = inject(CartsService);

  public readonly cartItems = this.cartsService.items;
}