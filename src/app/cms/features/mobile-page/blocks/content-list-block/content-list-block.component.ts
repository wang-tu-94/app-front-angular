import {Component} from "@angular/core";
import {InputText} from "primeng/inputtext";
import {FormsModule} from "@angular/forms";
import {BaseBlockComponent} from "../base-block/base-block.component";
import {ContentListBlock} from "../../../../data-access/mobile-pages.model";
import {CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, moveItemInArray} from "@angular/cdk/drag-drop";
import {ContentEditableDirective} from "../../../../../shared/directives/content.editable.directive";
import {Button} from "primeng/button";
import {ContentEditorComponent} from "../../../../ui/content-editor/content-editor.component";
import {Accordion, AccordionContent, AccordionHeader, AccordionPanel} from "primeng/accordion";
import {Tooltip} from "primeng/tooltip";
import {randomUUID} from "node:crypto";

@Component({
  selector: "app-content-list-block",
  templateUrl: "./content-list-block.component.html",
  styleUrls: ["./content-list-block.component.scss"],
  standalone: true,
  imports: [
    InputText,
    FormsModule,
    ContentEditableDirective,
    Button,
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
    ContentEditorComponent,
    Accordion,
    AccordionPanel,
    AccordionHeader,
    AccordionContent,
    Tooltip
  ]
})
export class ContentListBlockComponent extends BaseBlockComponent<ContentListBlock> {
  public activePanels: any[] = [];

  public openPanel(item: any) {
    const uniqueId = item._id;

    const isAlreadyOpen = this.activePanels.includes(uniqueId);

    if (!isAlreadyOpen) {
      this.activePanels = [...this.activePanels, uniqueId];
    }

    const scrollDelay = isAlreadyOpen ? 50 : 350;

    setTimeout(() => {
      const sidebarElement = document.getElementById(`sidebar-panel-${uniqueId}`);
      if (sidebarElement) {
        sidebarElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }, scrollDelay);
  }

  public addContent() {
    const id = randomUUID();
    this.block().contents.push({
      _id: id,
      title: 'Nouveau contenu',
      description: ''
    });
    this.activePanels = [...this.activePanels, id];
  }

  public removeContent(index: number) {
    this.block().contents.splice(index, 1);
  }

  public drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.block().contents, event.previousIndex, event.currentIndex);
  }

  public scrollToCenterCard(item: any, event: Event) {
    // Empêche l'accordéon de se plier/déplier quand on clique sur ce bouton
    event.stopPropagation();
    event.preventDefault();

    const centerCard = document.getElementById(`center-card-${item._id}`);

    if (centerCard) {
      centerCard.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }
}
