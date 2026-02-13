import { Routes } from "@angular/router";
import {RegisterComponent} from "./features/register/register.component";
import {LoginComponent} from "./features/login/login.component";

export const AUTH_ROUTES: Routes = [
	{
		path: "register",
		component: RegisterComponent,
	},
  {
    path: "login",
    component: LoginComponent,
  },
	{ path: "**", redirectTo: "register" },
];
