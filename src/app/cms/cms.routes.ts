import { Routes } from "@angular/router";
import {MobilePageListComponent} from "./features/mobile-page-list/mobile-page-list.component";
import {MobilePageComponent} from "./features/mobile-page/mobile-page.component";


export const CMS_ROUTES: Routes = [
	{
		path: "mobile/pages",
		component: MobilePageListComponent,
	},
  {
    path: "mobile/pages/:id",
    component: MobilePageComponent,
  },
	{ path: "**", redirectTo: "mobile/pages" },
];
