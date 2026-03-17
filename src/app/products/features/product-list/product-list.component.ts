import {Component, OnInit, inject, signal, computed} from "@angular/core";
import {categories, Product, ProductFilter} from "app/products/data-access/product.model";
import { ProductsService } from "app/products/data-access/products.service";
import { ProductFormComponent } from "app/products/ui/product-form/product-form.component";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import {DataViewModule, DataViewPageEvent} from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import {CartControlsComponent} from "../../../carts/ui/cart-controls/cart-controls.component";
import {RatingModule} from "primeng/rating";
import {FormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {TagModule} from "primeng/tag";
import {MenuModule} from "primeng/menu";
import {MenuItem} from "primeng/api";
import {SplitButtonModule} from "primeng/splitbutton";
import {ToolbarModule} from "primeng/toolbar";
import {CartsService} from "../../../carts/data-access/carts.service";
import {SelectModule} from "primeng/select";

const emptyProduct: Product = {
  code: "",
  name: "",
  description: "",
  image: "",
  category: "",
  price: 0,
  quantity: 0,
  internalReference: "",
  inventoryStatus: "INSTOCK",
};

@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.scss"],
  standalone: true,
  imports: [DataViewModule, CardModule, ButtonModule, DialogModule, ProductFormComponent, CommonModule, CartControlsComponent, RatingModule, FormsModule, InputTextModule, SelectModule, TagModule, MenuModule, SplitButtonModule, ToolbarModule]
})
export class ProductListComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly cartsService = inject(CartsService);

  public readonly products = this.productsService.products;

  public isDialogVisible = false;
  public isCreation = false;
  public readonly editedProduct = signal<Product>(emptyProduct);
  public readonly categories = categories;

  filter: ProductFilter = {};

  ngOnInit() {
    this.cartsService.get();
    this.productsService.get().subscribe();
  }

  public search() {
    this.productsService.setFilter(this.filter);
  }

  public reset() {
    this.filter = {};
    this.productsService.resetFilter();
  }

  public getSeverity(product: Product) {
    switch (product.inventoryStatus) {
      case "INSTOCK": return "success"
      case "LOWSTOCK": return "warn"
      case "OUTOFSTOCK": return "danger"
    }
  }

  getMenuItems(product: Product): MenuItem[] {
    return [
      {
        label: 'Modifier',
        icon: 'pi pi-pencil',
        command: () => this.onUpdate(product)
      },
      {
        label: 'Supprimer',
        icon: 'pi pi-trash',
        command: () => this.onDelete(product)
      }
    ];
  }

  public onCreate() {
    this.isCreation = true;
    this.isDialogVisible = true;
    this.editedProduct.set(emptyProduct);
  }

  public onUpdate(product: Product) {
    this.isCreation = false;
    this.isDialogVisible = true;
    this.editedProduct.set(product);
  }

  public onDelete(product: Product) {
    this.productsService.delete(product.id!).subscribe();
  }

  public onSave(product: Product) {
    if (this.isCreation) {
      this.productsService.create(product).subscribe();
    } else {
      this.productsService.update(product).subscribe();
    }
    this.closeDialog();
  }

  public onCancel() {
    this.closeDialog();
  }

  private closeDialog() {
    this.isDialogVisible = false;
  }

  protected onPageChange($event: DataViewPageEvent) {
    const newPage = $event.first / $event.rows;

    this.filter = {
      ...this.filter,
      page: newPage
    };

    this.search();
  }
}
