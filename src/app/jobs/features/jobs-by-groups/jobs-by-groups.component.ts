import {Component, inject} from "@angular/core";
import {JobStore} from "../../data-access/jobs.store";
import {TreeTableModule} from "primeng/treetable";
import {ConfirmDialog} from "primeng/confirmdialog";
import {JobGroupTableComponent} from "../../ui/job-group-table/job-group-table.component";
import {KeyValuePipe} from "@angular/common";
import {MenuItem} from "primeng/api";
import {JobHeaderComponent} from "../../ui/job-header/job-header.component";


@Component({
  selector: 'app-jobs-by-groups',
  templateUrl: "./jobs-by-groups.component.html",
  styleUrls: ["./jobs-by-groups.component.scss"],
  standalone: true,
  imports: [
    TreeTableModule,
    ConfirmDialog,
    JobGroupTableComponent,
    KeyValuePipe,
    JobHeaderComponent

  ]
})
export class JobsByGroupsComponent {
  readonly store = inject(JobStore);

  breadcrumb: MenuItem[] = [
    { label: 'Tous les groupes' }
  ];

  constructor() {
    this.store.loadAll();
  }
}
