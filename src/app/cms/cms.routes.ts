import { Routes } from "@angular/router";
import {MobilePageListComponent} from "./features/mobile-page-list/mobile-page-list.component";


export const CMS_ROUTES: Routes = [
	{
		path: "mobile/pages",
		component: MobilePageListComponent,
	},
	{ path: "**", redirectTo: "mobile/pages" },
];
