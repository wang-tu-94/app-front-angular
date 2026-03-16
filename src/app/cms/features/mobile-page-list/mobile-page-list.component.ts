import {Component, inject, OnInit, signal} from "@angular/core";
import {MobilePagesService} from "../../data-access/mobile-pages.service";
import {MobilePage, MobilePageFilter} from "../../data-access/mobile-pages.model";
import {TableModule} from "primeng/table";
import {DataViewModule} from "primeng/dataview";
import {DatePipe} from "@angular/common";
import {Button} from "primeng/button";
import {DropdownModule} from "primeng/dropdown";
import {ToolbarModule} from "primeng/toolbar";
import {categories} from "../../../products/data-access/product.model";
import {BadgeModule} from "primeng/badge";

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
    DropdownModule,
    ToolbarModule,
    BadgeModule
  ],
})
export class MobilePageListComponent implements OnInit {
  private readonly mobilePagesService = inject(MobilePagesService);

  public readonly pages = this.mobilePagesService.pages;
  public readonly loading = this.mobilePagesService.loading;
  public readonly totalElements = this.mobilePagesService.totalElements;
  public readonly totalPages = this.mobilePagesService.totalPages;

  filter: MobilePageFilter = {};

  ngOnInit() {
    this.search();
  }

  public onCreate() {

  }

  public search() {
    this.mobilePagesService.search()
  }

  public reset() {
    this.filter = {};
    this.mobilePagesService.clearSelection();
  }

  public stateSeverity(page: MobilePage) {
    switch (page.state) {
      case "ONLINE": return "success"
      case "OFFLINE": return "info"
      case "DELETED": return"danger"
    }
  }
}
