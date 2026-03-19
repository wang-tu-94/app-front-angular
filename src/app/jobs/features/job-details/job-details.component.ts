import {Component, computed, effect, inject, input, signal} from "@angular/core";
import {JobStore} from "../../data-access/jobs.store";
import {ConfirmationService, MenuItem} from "primeng/api";
import {JobHeaderComponent} from "../../ui/job-header/job-header.component";
import {Card} from "primeng/card";
import {Tag} from "primeng/tag";
import {DatePipe} from "@angular/common";
import {Button} from "primeng/button";
import {Router} from "@angular/router";
import {ConfirmDialog} from "primeng/confirmdialog";
import {Tooltip} from "primeng/tooltip";
import {InputText} from "primeng/inputtext";
import {FormsModule} from "@angular/forms";
import {InputGroup} from "primeng/inputgroup";
import {InputGroupAddon} from "primeng/inputgroupaddon";
import {JobLogsBrowserComponent} from "../../ui/job-logs-browser/job-logs-browser.component";


@Component({
  selector: 'app-job-details',
  templateUrl: "./job-details.component.html",
  styleUrls: ["./job-details.component.scss"],
  standalone: true,
  imports: [
    JobHeaderComponent,
    Card,
    Tag,
    DatePipe,
    Button,
    ConfirmDialog,
    Tooltip,
    InputText,
    FormsModule,
    InputGroup,
    InputGroupAddon,
    JobLogsBrowserComponent

  ]
})
export class JobDetailsComponent {
  readonly store = inject(JobStore);
  private readonly router = inject(Router);
  private readonly confirmationService = inject(ConfirmationService);

  jobGroup = input.required<string>();
  jobName = input.required<string>();

  isEditingCron = signal(false);
  newCronValue = signal('');

  job = computed(() => this.store.getJob(this.jobGroup(), this.jobName()));

  breadcrumb = computed<MenuItem[]>(() => [
    { label: 'Tous les groupes', routerLink: '/jobs' },
    { label: this.jobGroup(), routerLink: ['/groups', this.jobGroup()] },
    { label: this.jobName() }
  ]);

  constructor() {
    effect(() => {
      this.store.loadOne(this.jobGroup(), this.jobName());
    });
  }

  pauseJob() {
    this.store.pauseJob(this.jobGroup(), this.jobName());
  }

  resumeJob() {
    this.store.resumeJob(this.jobGroup(), this.jobName());
  }

  deleteJob() {
    this.confirmationService.confirm({
      header: 'Confirmation de suppression',
      message: `Êtes-vous sûr de vouloir supprimer définitivement le job <b>${this.jobName()}</b> ?`,
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: async () => {
        await this.store.deleteJob(this.jobGroup(), this.jobName());
        this.router.navigate(['/groups', this.jobGroup()]);
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

  startEditCron() {
    // On pré-remplit l'input avec la valeur actuelle du CRON
    this.newCronValue.set(this.job()!.cronExpression);
    this.isEditingCron.set(true);
  }

  cancelEditCron() {
    this.isEditingCron.set(false);
  }

  confirmCronUpdate() {
    this.confirmationService.confirm({
      header: 'Modification du CRON',
      message: `Voulez-vous vraiment appliquer la nouvelle expression CRON pour le job <b>${this.jobName()}</b> ? <br><br>Nouvelle valeur : <span class="font-mono font-bold text-green-600 bg-green-50 px-2 py-1 border-round">${this.newCronValue()}</span>`,
      icon: 'pi pi-question-circle',
      acceptLabel: 'Mettre à jour',
      acceptButtonStyleClass: 'p-button-success',
      rejectLabel: 'Annuler',
      accept: async () => {
        await this.store.updateCron(this.jobGroup(), this.jobName(), { cron: this.newCronValue() });
        this.isEditingCron.set(false);
      }
    });
  }
}
