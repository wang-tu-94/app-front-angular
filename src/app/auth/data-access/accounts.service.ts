import {Injectable, signal, inject, computed} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable, tap} from "rxjs";
import {Account, LoginRequest, LoginResponse, RegisterRequest} from "./account.model";

@Injectable({providedIn: 'root'})
export class AccountsService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly http = inject(HttpClient);
  private readonly path = "/api/ms-auth/v1/accounts";
  private readonly loginPath = "/api/ms-auth/v1/auth";
  private readonly API_URL = environment.apiUrl;

  private readonly _token = signal<string | null>(localStorage.getItem(this.TOKEN_KEY))
  public readonly token = this._token.asReadonly()

  private readonly _account = signal<Account>({});
  public readonly account = this._account.asReadonly();

  public readonly isAuthenticated = computed(() => !!this._token());

  public register(request: RegisterRequest): Observable<Account> {
    return this.http.post<Account>(`${this.API_URL}${this.path}/register`, request).pipe(
      tap(account => {
        this._account.set(account);
      })
    )
  }

  public login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}${this.loginPath}/login`, request).pipe(
      tap(loginResponse => {
        if (loginResponse?.token) {
          this.saveToken(loginResponse.token);
          this._account.set(loginResponse.account!);
        }
      })
    )
  }

  public logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    this._token.set(null);
    this._account.set({});
  }

  private saveToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
    this._token.set(token);
  }


}
