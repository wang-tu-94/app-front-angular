import {enableProdMode, importProvidersFrom, LOCALE_ID} from "@angular/core";

import { registerLocaleData } from "@angular/common";
import {
  provideHttpClient, withInterceptors,
  withInterceptorsFromDi,
} from "@angular/common/http";
import localeFr from "@angular/common/locales/fr";
import { BrowserModule, bootstrapApplication } from "@angular/platform-browser";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideRouter } from "@angular/router";
import { APP_ROUTES } from "app/app.routes";
import { ConfirmationService, MessageService } from "primeng/api";
import { DialogService } from "primeng/dynamicdialog";
import { AppComponent } from "./app/app.component";
import { environment } from "./environments/environment";
import {authInterceptor} from "./app/core/interceptors/auth.interceptor";

if (environment.production) {
  enableProdMode();
}

registerLocaleData(localeFr, "fr-FR");

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule),
    provideHttpClient(
      withInterceptorsFromDi(),
      withInterceptors([authInterceptor])
    ),
    provideAnimations(),
    provideRouter(APP_ROUTES),
    ConfirmationService,
    MessageService,
    DialogService,
    { provide: LOCALE_ID, useValue: 'fr-FR' }
  ],
}).catch((err) => console.log(err));

