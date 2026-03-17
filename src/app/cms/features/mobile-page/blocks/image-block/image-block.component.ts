import {Component} from "@angular/core";
import {BaseBlockComponent} from "../base-block/base-block.component";
import {ImageBlock} from "../../../../data-access/mobile-pages.model";
import {InputText} from "primeng/inputtext";
import {FormsModule} from "@angular/forms";
import {ContentEditableDirective} from "../../../../../shared/directives/content.editable.directive";

@Component({
  selector: "app-image-block",
  templateUrl: "./image-block.component.html",
  styleUrls: ["./image-block.component.scss"],
  standalone: true,
  imports: [
    InputText,
    FormsModule,
    ContentEditableDirective
  ]
})
export class ImageBlockComponent extends BaseBlockComponent<ImageBlock> {

}
