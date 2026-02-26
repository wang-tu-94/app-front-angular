import {Injectable, inject, signal, computed} from "@angular/core";
import {Product, ProductFilter} from "./product.model";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable, switchMap, tap} from "rxjs";
import {environment} from "../../../environments/environment";
import {Page} from "../../core/model/page.model";

@Injectable({
  providedIn: "root"
})
export class ProductsService {

  private readonly http = inject(HttpClient);
  private readonly path = "/api/product-backend/v1/products";
  private readonly API_URL = environment.apiUrl;

  private readonly _products = signal<Page<Product> | undefined>(undefined);
  public readonly products = this._products.asReadonly();

  private readonly _filter = signal<ProductFilter>({page: 0});

  public get(): Observable<Page<Product>> {
    const currentFilter = this._filter();

    let params = new HttpParams()
      .set('page', (currentFilter.page || 0).toString())
      .set('size', '10');

    if (currentFilter.category) {
      params = params.set('category', currentFilter.category);
    }

    return this.http.get<Page<Product>>(`${this.API_URL}${this.path}`, { params }).pipe(
      tap(res => this._products.set(res))
    );

  }

  public create(product: Product) {
    return this.http.post<Product>(`${this.API_URL}${this.path}`, product).pipe(
      switchMap(() => this.get()) // On enchaîne proprement sans .subscribe()
    );
  }

  /**
   * Mise à jour : PUT puis rafraîchissement
   */
  public update(product: Product): Observable<Page<Product>> {
    return this.http.put<Product>(`${this.API_URL}${this.path}/${product.id}`, product).pipe(
      switchMap(() => this.get())
    );
  }

  /**
   * Suppression : DELETE puis rafraîchissement
   */
  public delete(productId: number): Observable<Page<Product>> {
    return this.http.delete<void>(`${this.API_URL}${this.path}/${productId}`).pipe(
      switchMap(() => this.get())
    );
  }

  setFilter(filter: ProductFilter) {
    this._filter.set({ ...filter });
    this.get().subscribe();
  }

  resetFilter() {
    this._filter.set({ page: 0 });
    this.get().subscribe();
  }
}
