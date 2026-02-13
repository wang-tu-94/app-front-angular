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
import {InputTextareaModule} from "primeng/inputtextarea";
import {Button, ButtonDirective} from "primeng/button";
import {CardModule} from "primeng/card";
import {PanelModule} from "primeng/panel";
import {InputTextModule} from "primeng/inputtext";
import {Toast, ToastModule} from "primeng/toast";
import {AccountsService} from "../../data-access/accounts.service";
import {LoginRequest, RegisterRequest} from "../../data-access/account.model";
import {DynamicDialogRef} from "primeng/dynamicdialog";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, InputTextareaModule, CardModule, PanelModule, Button, InputTextModule, ToastModule],
})
export class LoginComponent {
  @ViewChild('toast') toast!: Toast;
  private readonly accountService = inject(AccountsService);

  loginRequest = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  constructor(private fb: FormBuilder, public ref: DynamicDialogRef) {}

  get email() {
    return this.loginRequest.get('email')!;
  }

  get password() {
    return this.loginRequest.get('password')!;
  }

  isInvalid(control: any): boolean {
    return control.invalid && (control.dirty || control.touched);
  }

  isValid(control: any): boolean {
    return control.valid && (control.dirty || control.touched);
  }

  onSubmit() {
    if (this.loginRequest.valid) {
      const loginRequest = this.loginRequest.value as LoginRequest;

      this.accountService.login(loginRequest).subscribe({
        next: (response) => {
          console.log('Form submitted:', this.loginRequest.value);
          this.ref?.close();
        },
        error: (error) => {
          this.toast.add([{
            severity: 'error',
            summary: 'Erreur',
            detail: 'Erreur lors de l\'authentification',
            life: 3000
          }]);
          console.error(error);
        },
        complete: () => {
          this.loginRequest.reset();
        }
      });
    } else {
      this.loginRequest.markAllAsTouched();
      this.loginRequest.updateValueAndValidity();
    }
  }
}
