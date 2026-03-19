import {Component, inject, input} from "@angular/core";
import {Breadcrumb} from "primeng/breadcrumb";
import {Toolbar} from "primeng/toolbar";
import {Button} from "primeng/button";
import {MenuItem} from "primeng/api";
import {DialogService} from "primeng/dynamicdialog";
import {JobCreateModalComponent} from "../job-create-modal/job-create-modal.component";


@Component({
  selector: 'app-job-header',
  templateUrl: "./job-header.component.html",
  styleUrls: ["./job-header.component.scss"],
  standalone: true,
  imports: [
    Breadcrumb,
    Toolbar,
    Button

  ]
})
export class JobHeaderComponent {
  title = input.required<string>();
  breadcrumbItems = input.required<MenuItem[]>();
  showNewJobButton = input<boolean>(true);

  private readonly dialogService = inject(DialogService);

  homeIcon: MenuItem = { icon: 'pi pi-home', routerLink: '/home' };

  openCreateModal() {
    this.dialogService.open(JobCreateModalComponent, {
      header: 'Planifier un nouveau Job',
      width: '30vw',
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      },
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true
    });
  }
}
