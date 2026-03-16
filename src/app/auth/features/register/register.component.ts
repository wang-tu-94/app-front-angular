import {Component, inject, ViewChild} from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {Button, ButtonDirective} from "primeng/button";
import {CardModule} from "primeng/card";
import {PanelModule} from "primeng/panel";
import {InputTextModule} from "primeng/inputtext";
import {Toast, ToastModule} from "primeng/toast";
import {AccountsService} from "../../data-access/accounts.service";
import {RegisterRequest} from "../../data-access/account.model";
import {TextareaModule} from "primeng/textarea";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, TextareaModule, CardModule, PanelModule, Button, InputTextModule, ToastModule]
})
export class RegisterComponent {
  @ViewChild('toast') toast!: Toast;
  private readonly accountService = inject(AccountsService);

  // La Regex : 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial, min 8 caractères
  private readonly passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      // On définit une erreur sur le champ de confirmation
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  };

  registerForm = this.fb.group({
    username: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.pattern(this.passwordPattern)]],
    confirmPassword: ['', [Validators.required]]
  }, {
    validators: this.passwordMatchValidator // Validateur au niveau du groupe
  });

  constructor(private fb: FormBuilder) {}

  get username() {
    return this.registerForm.get('username')!;
  }

  get email() {
    return this.registerForm.get('email')!;
  }

  get password() {
    return this.registerForm.get('password')!;
  }

  get confirmPassword() { return this.registerForm.get('confirmPassword')!; }

  isInvalid(control: any): boolean {
    return control.invalid && (control.dirty || control.touched);
  }

  isValid(control: any): boolean {
    return control.valid && (control.dirty || control.touched);
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const registerRequest = this.registerForm.value as RegisterRequest;

      this.accountService.register(registerRequest).subscribe({
        next: (response) => {
          console.log('Form submitted:', this.registerForm.value);
          this.toast.add([{
            severity: 'success',
            summary: 'Succès',
            detail: 'Demande de création de compte envoyée avec succès',
            life: 3000
          }]);
        },
        error: (error) => {
          this.toast.add([{
            severity: 'error',
            summary: 'Erreur',
            detail: 'Erreur lors de la création du compte',
            life: 3000
          }]);
          console.error(error);
        },
        complete: () => {
          this.registerForm.reset();
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
      this.registerForm.updateValueAndValidity();
    }
  }
}
