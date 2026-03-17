import {Component, model} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {InputText} from "primeng/inputtext";
import {Content} from "../../data-access/mobile-pages.model";
import {Textarea} from "primeng/textarea";

@Component({
  selector: 'app-content-editor',
  templateUrl: "./content-editor.component.html",
  styleUrls: ["./content-editor.component.scss"],
  standalone: true,
  imports: [
    InputText,
    FormsModule,
    Textarea
  ]
})
export class ContentEditorComponent {
  content = model.required<Content>();
}
