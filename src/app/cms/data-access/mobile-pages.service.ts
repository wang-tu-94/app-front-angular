import {Injectable, signal, inject, computed} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {finalize, map, Observable, tap} from "rxjs";
import {BlockHydrators, MobilePage, MobilePageFilter} from "./mobile-pages.model";
import {SpringPage} from "../../shared/data-access/page.model";

@Injectable({providedIn: 'root'})
export class MobilePagesService {
  private readonly http = inject(HttpClient);
  private readonly path = "/api/ms-cms/v1/mobile/page";
  private readonly API_URL = environment.apiUrl;

  private readonly _pages = signal<MobilePage[]>([]);
  private readonly _selectedPage = signal<MobilePage | null>(null);
  private readonly _loading = signal<boolean>(false);

  private readonly _pageNumber = signal<number>(0);
  private readonly _totalPages = signal<number>(0);
  private readonly _totalElements = signal<number>(0);

  public readonly pages = this._pages.asReadonly();
  public readonly loading = this._loading.asReadonly();

  public readonly pageNumber = this._pageNumber.asReadonly();
  public readonly totalPages = this._totalPages.asReadonly();
  public readonly totalElements = this._totalElements.asReadonly();

  /**
   * Appelle l'API de recherche filtrée
   * @param filter Objet MobilePageFilter (name, state, date, ids)
   */
  search(filter: MobilePageFilter = {}, page: number = 0, size: number = 10) {
    this._loading.set(true);

    const params = Object.fromEntries(
      Object.entries({ ...filter, page, size }).filter(([_, v]) => v != null)
    );

    this.http.get<SpringPage<MobilePage>>(`${this.API_URL}${this.path}`, { params })
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe({
        next: (response) => {
          this._pages.set(response.content);
          this._pageNumber.set(response.number);
          this._totalPages.set(response.totalPages);
          this._totalElements.set(response.totalElements);
        },
        error: () => {
          this._pages.set([]);
          this._pageNumber.set(0);
          this._totalPages.set(0);
          this._totalElements.set(0);
        }
      });
  }

  get(id: string) {
    return this.http.get<MobilePage>(`${this.API_URL}${this.path}/${id}`).pipe(
      map(page => {
        page.blocks ??= [];

        page.blocks.forEach(block => {
          block._id = randomUUID();
          BlockHydrators[block.type]?.(block);
        });
        return page;
      })
    )
  }

  save(page: MobilePage) {
    return this.http.post<MobilePage>(`${this.API_URL}${this.path}`, page);
  }

  clearSelection() {
    this._selectedPage.set(null);
  }

}
