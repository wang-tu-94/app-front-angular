import { HttpInterceptorFn } from '@angular/common/http';
import {environment} from "../../../environments/environment";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // On récupère le token directement depuis la config d'environnement
  const serviceToken = environment.serviceToken;

  // On clone la requête pour injecter le header
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${serviceToken}`
    }
  });

  return next(authReq);
};
