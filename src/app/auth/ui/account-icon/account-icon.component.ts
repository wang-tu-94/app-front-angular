import {Component, inject} from "@angular/core";
import {AccountsService} from "../../data-access/accounts.service";
import {DialogService} from "primeng/dynamicdialog";
import {LoginComponent} from "../../features/login/login.component";
import {Button} from "primeng/button";
import {AvatarModule} from "primeng/avatar";

@Component({
  selector: 'app-account-icon',
  templateUrl: "./account-icon.component.html",
  styleUrls: ["./account-icon.component.scss"],
  standalone: true,
  imports: [
    Button,
    AvatarModule
  ]
})
export class AccountIconComponent {
  private readonly dialogService = inject(DialogService);
  public readonly accountService = inject(AccountsService);
  public readonly account = this.accountService.account;

  showLogin() {
    this.dialogService.open(LoginComponent, {
      header: 'Connexion',
      width: '350px'
    });
  }
}
