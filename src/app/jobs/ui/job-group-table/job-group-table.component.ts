import {Component, inject, input} from "@angular/core";
import {JobStore} from "../../data-access/jobs.store";
import {ConfirmationService} from "primeng/api";
import {Job} from "../../data-access/jobs.model";
import {Router} from "@angular/router";
import {TreeTableModule} from "primeng/treetable";
import {Tag} from "primeng/tag";
import {DatePipe} from "@angular/common";
import {Button} from "primeng/button";
import {Tooltip} from "primeng/tooltip";
import {TableModule} from "primeng/table";
import {Panel} from "primeng/panel";


@Component({
  selector: 'app-job-group-table',
  templateUrl: "./job-group-table.component.html",
  styleUrls: ["./job-group-table.component.scss"],
  standalone: true,
  imports: [
    TreeTableModule,
    Tag,
    DatePipe,
    Button,
    Tooltip,
    TableModule,
    Panel

  ]
})
export class JobGroupTableComponent {
  groupName = input.required<string>();
  jobs = input.required<Job[]>();

  readonly store = inject(JobStore);
  readonly router = inject(Router);
  private readonly confirmationService = inject(ConfirmationService);

  constructor() {
    this.store.loadAll();
  }
  goToGroup(event: Event, groupName: string) {
    event.stopPropagation();
    this.router.navigate(['/jobs/jobs/groups', groupName]);
  }

  goToDetail(group: string, name: string) {
    this.router.navigate(['/jobs/jobs/groups', group, 'jobs', name]);
  }

  pauseJob(group: string, name: string) {
    this.store.pauseJob(group, name);
  }

  resumeJob(group: string, name: string) {
    this.store.resumeJob(group, name);
  }

  deleteJob(group: string, name: string) {
    this.confirmationService.confirm({
      header: 'Confirmation de suppression',
      message: `Êtes-vous sûr de vouloir supprimer définitivement le job <b>${name}</b> du groupe <b>${group}</b> ?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Oui, supprimer',
      rejectLabel: 'Annuler',
      rejectButtonStyleClass: 'p-button-text p-button-secondary',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.store.deleteJob(group, name);
      }
    });
  }

  getSeverity(status: string) {
    switch (status) {
      case 'NORMAL': return 'success';
      case 'PAUSED': return 'warn';
      case 'ERROR': return 'danger';
      case 'EXECUTING': return 'info';
      default: return 'secondary';
    }
  }
}
