import {Component} from "@angular/core";
import {InputText} from "primeng/inputtext";
import {FormsModule} from "@angular/forms";
import {BaseBlockComponent} from "../base-block/base-block.component";
import {EventBlock} from "../../../../data-access/mobile-pages.model";
import {ContentEditorComponent} from "../../../../ui/content-editor/content-editor.component";
import {ContentEditableDirective} from "../../../../../shared/directives/content.editable.directive";

@Component({
  selector: "app-event-block",
  templateUrl: "./event-block.component.html",
  styleUrls: ["./event-block.component.scss"],
  standalone: true,
  imports: [
    InputText,
    FormsModule,
    ContentEditorComponent,
    ContentEditableDirective
  ]
})
export class EventBlockComponent extends BaseBlockComponent<EventBlock> {

}
