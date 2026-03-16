import {Component, inject, ViewChild} from "@angular/core";
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputTextareaModule} from "primeng/inputtextarea";
import {Button, ButtonDirective} from "primeng/button";
import {CardModule} from "primeng/card";
import {PanelModule} from "primeng/panel";
import {InputTextModule} from "primeng/inputtext";
import {Toast, ToastModule} from "primeng/toast";

@Component({
    selector: "app-contact",
    templateUrl: "./contact.component.html",
    styleUrls: ["./contact.component.scss"],
    imports: [FormsModule, ReactiveFormsModule, InputTextareaModule, CardModule, PanelModule, Button, InputTextModule, ToastModule]
})
export class ContactComponent {
  @ViewChild('toast') toast!: Toast;

  contactForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.maxLength(300)]]
  });

  successMessage = [{ severity: 'success', summary: 'Succès', detail: 'Votre message a été envoyé !' }];

  constructor(private fb: FormBuilder) {}

  get email() {
    return this.contactForm.get('email')!;
  }

  get message() {
    return this.contactForm.get('message')!;
  }

  isInvalid(control: any): boolean {
    return control.invalid && (control.dirty || control.touched);
  }

  isValid(control: any): boolean {
    return control.valid && (control.dirty || control.touched);
  }

  onSubmit() {
    if (this.contactForm.valid) {
      console.log('Form submitted:', this.contactForm.value);
      this.toast.add([{
        severity: 'success',
        summary: 'Succès',
        detail: 'Demande de contact envoyée avec succès',
        life: 3000 // 3 secondes
      }]);
      this.contactForm.reset();
    } else {
      this.contactForm.markAllAsTouched();
      this.contactForm.updateValueAndValidity();
    }
  }
}