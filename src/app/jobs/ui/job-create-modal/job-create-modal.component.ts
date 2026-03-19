import {Component, inject, signal} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {DatePickerModule} from "primeng/datepicker";
import {ButtonModule} from "primeng/button";
import {DynamicDialogRef} from "primeng/dynamicdialog";
import {JobStore} from "../../data-access/jobs.store";
import {JobTypeSelectComponent} from "../job-type-select/job-type-select.component";

@Component({
  selector: 'app-job-create-modal',
  templateUrl: "./job-create-modal.component.html",
  styleUrls: ["./job-create-modal.component.scss"],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    DatePickerModule,
    ButtonModule,
    JobTypeSelectComponent
  ]
})
export class JobCreateModalComponent {
  private fb = inject(FormBuilder);
  private ref = inject(DynamicDialogRef); // Pour fermer la modale

  private store = inject(JobStore);

  isSaving = signal(false);

  jobForm = this.fb.group({
    group: ['', Validators.required],
    name: ['', Validators.required],
    jobType: [null, Validators.required],
    cron: ['', Validators.required]
  });

  async onSubmit() {
    if (this.jobForm.valid) {
      this.isSaving.set(true);
      try {
        // On appelle la méthode 'schedule' qu'on avait mise dans le Store
        await this.store.schedule(this.jobForm.value as any);

        // On ferme la modale en renvoyant 'true' (succès)
        this.ref.close(true);
      } catch (error) {
        console.error('Erreur lors de la création', error);
        this.isSaving.set(false);
      }
    }
  }

  close() {
    this.ref.close(false); // Fermeture sans sauvegarde
  }
}
