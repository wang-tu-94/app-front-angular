import {Component, computed, effect, inject, input, signal} from "@angular/core";
import {JobStore} from "../../data-access/jobs.store";
import {JobGroupTableComponent} from "../../ui/job-group-table/job-group-table.component";
import {ConfirmDialog} from "primeng/confirmdialog";
import {Button} from "primeng/button";
import {Toolbar} from "primeng/toolbar";
import {JobHeaderComponent} from "../../ui/job-header/job-header.component";
import {MenuItem} from "primeng/api";


@Component({
  selector: 'app-jobs-list',
  templateUrl: "./jobs-list.component.html",
  styleUrls: ["./jobs-list.component.scss"],
  standalone: true,
  imports: [
    JobGroupTableComponent,
    ConfirmDialog,
    JobHeaderComponent

  ]
})
export class JobsListComponent {
  readonly store = inject(JobStore);

  jobGroup = input.required<string>();

  jobs = computed(() => this.store.getJobsForGroup(this.jobGroup()));

  breadcrumb = computed<MenuItem[]>(() => [
    { label: 'Tous les groupes', routerLink: '/jobs' },
    { label: this.jobGroup() }
  ]);

  constructor() {
    effect(() => {
      this.store.loadGroup(this.jobGroup());
    });
  }
}
