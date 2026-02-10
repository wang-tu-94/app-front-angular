import {Injectable, inject, signal, computed} from "@angular/core";
import {Product, ProductFilter} from "./product.model";
import { HttpClient } from "@angular/common/http";
import { Observable, tap } from "rxjs";
import {environment} from "../../../environments/environment";
import {Page} from "../../core/model/page.model";

@Injectable({
    providedIn: "root"
}) export class ProductsService {

    private readonly http = inject(HttpClient);
    private readonly path = "/api/v1/products";
    private readonly API_URL = environment.apiUrl;

    private readonly _products = signal<Product[]>([]);

    public readonly products = this._products.asReadonly();

    private _filter = signal<ProductFilter>({});
    public readonly filter = this._filter.asReadonly();

    public readonly filteredProducts = computed(() => {
        const f = this._filter();
        return this._products().filter(p =>
          (!f.name || p.name.toLowerCase().includes(f.name.toLowerCase())) &&
          (!f.category || p.category === f.category)
        );
    });

    public get(): Observable<Page<Product>> {
        return this.http.get<Page<Product>>(`${this.API_URL}${this.path}`).pipe(
          tap(products => { this._products.set(products.content); }),
        );
    }

    public create(product: Product): Observable<boolean> {
        return this.http.post<boolean>(`${this.API_URL}${this.path}`, product).pipe(
            tap(() => this._products.update(products => [product, ...products])),
        );
    }

    public update(product: Product): Observable<boolean> {
        return this.http.put<boolean>(`${this.API_URL}${this.path}/${product.id}`, product).pipe(
            tap(() => this._products.update(products => {
                return products.map(p => p.id === product.id ? product : p)
            })),
        );
    }

    public delete(productId: number): Observable<boolean> {
        return this.http.delete<boolean>(`${this.API_URL}${this.path}/${productId}`).pipe(
            tap(() => this._products.update(products => products.filter(product => product.id !== productId))),
        );
    }

    setFilter(filter: ProductFilter) {
        this._filter.set({ ...filter });
    }

    resetFilter() {
        this._filter.set({});
    }
}
