import {Component, inject, OnDestroy, OnInit, signal} from "@angular/core";
import {MobilePagesService} from "../../data-access/mobile-pages.service";
import {MobilePage, MobilePageFilter, State, stateOptions} from "../../data-access/mobile-pages.model";
import {TableLazyLoadEvent, TableModule} from "primeng/table";
import {DataViewModule, DataViewPageEvent} from "primeng/dataview";
import {DatePipe} from "@angular/common";
import {Button} from "primeng/button";
import {ToolbarModule} from "primeng/toolbar";
import {categories} from "../../../products/data-access/product.model";
import {BadgeModule} from "primeng/badge";
import {SelectModule} from "primeng/select";
import {FormsModule} from "@angular/forms";
import {DatePicker} from "primeng/datepicker";
import {InputIcon} from "primeng/inputicon";
import {IconField} from "primeng/iconfield";
import {InputText} from "primeng/inputtext";
import {Tooltip} from "primeng/tooltip";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {MobilePageCreateComponent} from "../../ui/mobile-page-create/mobile-page-create.component";
import {Router} from "@angular/router";

@Component({
  selector: "app-mobile-page-list",
  templateUrl: "./mobile-page-list.component.html",
  styleUrls: ["./mobile-page-list.component.scss"],
  standalone: true,
  imports: [
    TableModule,
    DataViewModule,
    DatePipe,
    Button,
    SelectModule,
    ToolbarModule,
    BadgeModule,
    FormsModule,
    DatePicker,
    InputIcon,
    IconField,
    InputText,
    Tooltip
  ]
})
export class MobilePageListComponent implements OnDestroy {
  private readonly mobilePagesService = inject(MobilePagesService);
  private readonly dialogService = inject(DialogService);
  private readonly router = inject(Router);

  private dialogRef: DynamicDialogRef | null | undefined;
  public readonly pages = this.mobilePagesService.pages;
  public readonly loading = this.mobilePagesService.loading;
  public readonly totalElements = this.mobilePagesService.totalElements;
  public readonly totalPages = this.mobilePagesService.totalPages;

  filter: MobilePageFilter = {};

  public uiDate: Date | null = null;
  public stateOptions = stateOptions

  public firstPage = signal(0);
  public size = signal(10);

  ngOnDestroy() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }

  public onCreate() {
    this.dialogRef = this.dialogService.open(MobilePageCreateComponent, {
      header: 'Créer une nouvelle page',
      width: '400px',
      modal: true,
      closable: false
    });

    this.dialogRef!.onClose.subscribe((success: boolean) => {
      if (success) {
        this.search();
      }
    });
  }

  public onLazyLoad(event: TableLazyLoadEvent) {
    this.firstPage.set(event.first ?? 0);
    this.size.set(event.rows ?? 10);

    const page = Math.floor(this.firstPage() / this.size());

    this.mobilePagesService.search(this.filter, page || 0, this.size() || 10)
  }

  public search() {
    if (this.uiDate) {
      this.filter.afterPublishedDate = this.uiDate.getTime();
    } else {
      this.filter.afterPublishedDate = undefined;
    }

    this.firstPage.set(0);

    this.mobilePagesService.search(this.filter, 0, this.size());
  }

  public reset() {
    this.filter = {};
    this.uiDate = null;
    this.mobilePagesService.clearSelection(); // Si tu as gardé ça
    this.search();
  }

  public stateSeverity(page: MobilePage) {
    switch (page.state) {
      case "ONLINE": return "success"
      case "OFFLINE": return "info"
      case "DELETED": return"danger"
    }
  }

  public onEdit(id: string) {
    if (id) {
      this.router.navigate(['cms/mobile/pages', id]);
    }
  }
}
