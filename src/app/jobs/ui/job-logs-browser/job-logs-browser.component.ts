import {Component, inject, input, signal} from "@angular/core";
import {CommonModule, DatePipe} from "@angular/common";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {DatePickerModule} from "primeng/datepicker";
import {Button, ButtonModule} from "primeng/button";
import {DynamicDialogRef} from "primeng/dynamicdialog";
import {JobStore} from "../../data-access/jobs.store";
import {JobTypeSelectComponent} from "../job-type-select/job-type-select.component";
import {Card} from "primeng/card";
import {TableLazyLoadEvent, TableModule} from "primeng/table";
import {Tag} from "primeng/tag";
import {Tooltip} from "primeng/tooltip";
import {JobLogsService} from "../../data-access/job-logs.service";
import {ConfirmationService} from "primeng/api";

@Component({
  selector: 'app-job-logs-browser',
  templateUrl: "./job-logs-browser.component.html",
  styleUrls: ["./job-logs-browser.component.scss"],
  standalone: true,
  imports: [
    Card,
    Button,
    TableModule,
    Tag,
    DatePipe,
    Tooltip
  ]
})
export class JobLogsBrowserComponent {
  // L'Input magique
  jobName = input.required<string>();

  private readonly jobLogsService = inject(JobLogsService);
  private readonly confirmationService = inject(ConfirmationService);

  // L'état interne du composant
  logs = signal<any[]>([]); // Remplace any par JobLog
  totalRecords = signal<number>(0);
  isLoadingLogs = signal<boolean>(false);

  // PrimeNG déclenche ça tout seul au chargement et à chaque changement de page !
  loadLogs(event: TableLazyLoadEvent) {
    const page = Math.floor((event.first || 0) / (event.rows || 10));
    const size = event.rows || 10;
    this.fetchLogs(page, size);
  }

  fetchLogs(page: number, size: number) {
    this.isLoadingLogs.set(true);
    this.jobLogsService.getLogs(this.jobName(), page, size).subscribe({
      next: (springPage) => {
        this.logs.set(springPage.content);
        this.totalRecords.set(springPage.totalElements);
        this.isLoadingLogs.set(false);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des logs', err);
        this.isLoadingLogs.set(false);
      }
    });
  }

  confirmClearLogs() {
    this.confirmationService.confirm({
      header: 'Purger l\'historique',
      message: `Êtes-vous sûr de vouloir supprimer définitivement l'historique du job <b>${this.jobName()}</b> ?`,
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.isLoadingLogs.set(true);
        this.jobLogsService.deleteLogs(this.jobName()).subscribe({
          next: () => {
            // On force le retour à la page 0 après la suppression
            this.fetchLogs(0, 10);
          },
          error: () => this.isLoadingLogs.set(false)
        });
      }
    });
  }

  getLogSeverity(status: string) {
    switch (status?.toUpperCase()) {
      case 'SUCCESS': return 'success';
      case 'FAILED':
      case 'ERROR': return 'danger';
      case 'RUNNING': return 'info';
      default: return 'secondary';
    }
  }
}
