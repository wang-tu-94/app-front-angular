import { Routes } from "@angular/router";
import {CartComponent} from "./features/cart/cart.component";

export const CARTS_ROUTES: Routes = [
	{
		path: "cart",
		component: CartComponent,
	},
	{ path: "**", redirectTo: "cart" },
];
