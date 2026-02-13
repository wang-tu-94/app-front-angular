import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {environment} from "../../../environments/environment";
import {AccountsService} from "../../auth/data-access/accounts.service";
import {inject} from "@angular/core";
import {catchError, throwError} from "rxjs";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AccountsService);
  const token = authService.token() || environment.serviceToken;

  // On clone la requête pour injecter le header
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Logique de renouvellement ici ou déconnexion
        authService.logout();
        // Optionnel: router.navigate(['/login'])
      }
      return throwError(() => error);
    })
  );
};
