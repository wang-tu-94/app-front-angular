import { Routes } from "@angular/router";
import { HomeComponent } from "./shared/features/home/home.component";
import {CMS_ROUTES} from "./cms/cms.routes";

export const APP_ROUTES: Routes = [
  {
    path: "home",
    component: HomeComponent,
  },
  {
    path: "products",
    loadChildren: () =>
      import("./products/products.routes").then((m) => m.PRODUCTS_ROUTES)
  },
  {
    path: "carts",
    loadChildren: () =>
      import("./carts/carts.routes").then((m) => m.CARTS_ROUTES)
  },
  {
    path: "contacts",
    loadChildren: () =>
      import("./contacts/contacts.routes").then((m) => m.CONTACTS_ROUTES)
  },
  {
    path: "auth",
    loadChildren: () =>
      import("./auth/auth.routes").then((m) => m.AUTH_ROUTES)
  },
  {
    path: "cms",
    loadChildren: () =>
      import("./cms/cms.routes").then((m) => m.CMS_ROUTES)
  },
  {
    path: "jobs",
    loadChildren: () =>
      import("./jobs/jobs.routes").then((m) => m.JOBS_ROUTES)
  },

  { path: "", redirectTo: "home", pathMatch: "full" },
];
