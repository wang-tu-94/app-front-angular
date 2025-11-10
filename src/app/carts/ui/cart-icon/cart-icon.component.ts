import {Component, inject} from "@angular/core";
import {CartsService} from "../../data-access/carts.service";
import {RouterLink} from "@angular/router";

@Component({
    selector: 'app-cart-icon',
    standalone: true,
    templateUrl: "./cart-icon.component.html",
    styleUrls: ["./cart-icon.component.scss"],
    imports: [
        RouterLink
    ]
})
export class CartIconComponent {
    public readonly cartService = inject(CartsService);
}