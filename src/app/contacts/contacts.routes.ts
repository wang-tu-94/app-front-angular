import {Routes} from "@angular/router";
import {ContactComponent} from "./features/contact/contact.component";

export const CONTACTS_ROUTES: Routes = [
  {
    path: "contact",
    component: ContactComponent,
  },
  { path: "**", redirectTo: "contact" },
];
