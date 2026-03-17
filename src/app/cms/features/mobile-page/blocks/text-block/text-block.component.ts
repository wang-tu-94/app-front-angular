import {Component} from "@angular/core";
import {InputText} from "primeng/inputtext";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BaseBlockComponent} from "../base-block/base-block.component";
import {TextBlock} from "../../../../data-access/mobile-pages.model";
import {Textarea} from "primeng/textarea";
import {ContentEditableDirective} from "../../../../../shared/directives/content.editable.directive";

@Component({
  selector: "app-text-block",
  templateUrl: "./text-block.component.html",
  styleUrls: ["./text-block.component.scss"],
  standalone: true,
  imports: [
    InputText,
    FormsModule,
    ReactiveFormsModule,
    Textarea,
    ContentEditableDirective
  ]
})
export class TextBlockComponent extends BaseBlockComponent<TextBlock> {

}
