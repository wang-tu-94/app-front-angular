import {Component, inject, signal} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {DatePickerModule} from "primeng/datepicker";
import {ButtonModule} from "primeng/button";
import {DynamicDialogRef} from "primeng/dynamicdialog";
import {MobilePagesService} from "../../data-access/mobile-pages.service";
import {MobilePage} from "../../data-access/mobile-pages.model";

@Component({
  selector: 'app-mobile-page-create',
  templateUrl: "./mobile-page-create.component.html",
  styleUrls: ["./mobile-page-create.component.scss"],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    DatePickerModule,
    ButtonModule
  ]
})
export class MobilePageCreateComponent {
  private fb = inject(FormBuilder);
  private ref = inject(DynamicDialogRef); // Pour fermer la modale
  private mobilePagesService = inject(MobilePagesService); // 👈 On injecte le service ici

  public isSaving = signal(false); // Signal pour gérer le bouton de chargement
  public form = this.fb.group({
    name: ['', Validators.required],
    publishedDate: [null as Date | null]
  });

  public onSubmit() {
    if (this.form.invalid) return;

    this.isSaving.set(true); // Lance le spinner

    const formValues = this.form.value;
    const newPage: MobilePage = {
      name: formValues.name!,
      publishedDate: formValues.publishedDate ? formValues.publishedDate.getTime() : undefined,
      state: 'OFFLINE',
      blocks: []
    };

    this.mobilePagesService.save(newPage).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.ref.close(true);
      },
      error: (err) => {
        this.isSaving.set(false);
        console.error('Erreur de sauvegarde', err);
      }
    });
  }

  public onCancel() {
    this.ref.close(false); // On ferme en disant "Annulé"
  }
}
