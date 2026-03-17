import {Component, inject, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import {InputNumberModule} from "primeng/inputnumber";
import {FormsModule} from "@angular/forms";
import {DataViewModule} from "primeng/dataview";
import {CardModule} from "primeng/card";
import {CartControlsComponent} from "../../ui/cart-controls/cart-controls.component";
import {CartsService} from "../../data-access/carts.service";
import {TagModule} from "primeng/tag";

@Component({
    selector: 'app-cart',
    imports: [CommonModule, InputNumberModule, FormsModule, DataViewModule, CardModule, CartControlsComponent, TagModule],
    templateUrl: "./cart.component.html",
    styleUrls: ["./cart.component.scss"]
})
export class CartComponent implements OnInit {
  private readonly cartsService = inject(CartsService);

  public readonly cart = this.cartsService.cart;

  ngOnInit(): void {
    //this.cartsService.get()
  }


}
