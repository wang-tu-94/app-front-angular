import {Component, inject, OnInit, QueryList, signal, TemplateRef, ViewChildren} from "@angular/core";
import {MobilePagesService} from "../../data-access/mobile-pages.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Block, MobilePage, stateOptions} from "../../data-access/mobile-pages.model";
import {Button} from "primeng/button";
import {Select} from "primeng/select";
import {DatePicker} from "primeng/datepicker";
import {FormsModule} from "@angular/forms";
import {InputText} from "primeng/inputtext";
import {ProgressSpinner} from "primeng/progressspinner";
import {Drawer} from "primeng/drawer";
import {NgTemplateOutlet} from "@angular/common";
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragHandle,
  CdkDropList,
  moveItemInArray
} from "@angular/cdk/drag-drop";
import {Tooltip} from "primeng/tooltip";
import {ImageBlockComponent} from "./blocks/image-block/image-block.component";
import {TextBlockComponent} from "./blocks/text-block/text-block.component";
import {EventBlockComponent} from "./blocks/event-block/event-block.component";
import {ContentListBlockComponent} from "./blocks/content-list-block/content-list-block.component";
import {BaseBlockComponent} from "./blocks/base-block/base-block.component";
import {AddBlockModalComponent} from "../../ui/add-block-modal/add-block-modal.component";
import {MessageService} from "primeng/api";
import {Toast} from "primeng/toast";
import {blockTemplates} from "../../data-access/block-factory";

@Component({
  selector: "app-mobile-page",
  templateUrl: "./mobile-page.component.html",
  styleUrls: ["./mobile-page.component.scss"],
  standalone: true,
  imports: [
    Button,
    Select,
    DatePicker,
    FormsModule,
    InputText,
    ProgressSpinner,
    Drawer,
    NgTemplateOutlet,
    CdkDropList,
    CdkDrag,
    Tooltip,
    ImageBlockComponent,
    TextBlockComponent,
    EventBlockComponent,
    ContentListBlockComponent,
    CdkDragHandle,
    AddBlockModalComponent,
    Toast

  ]
})
export class MobilePageComponent implements OnInit {

  private readonly mobilePagesService = inject(MobilePagesService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private messageService = inject(MessageService);

  public mobilePage = signal<MobilePage | null>(null);
  public isSaving = signal(false);
  public sidebarVisible = signal(false);
  public activeTemplate = signal<TemplateRef<any> | null>(null);
  public activeBlock = signal<Block | null>(null);
  public isAddModalVisible = signal(false);

  public uiPublishedDate: Date | null = null;
  public stateOptions =  stateOptions

  @ViewChildren('blockInstance')
  blockInstances!: QueryList<BaseBlockComponent>;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.loadPage(id);
    } else {
      this.goBack();
    }
  }

  private loadPage(id: string) {
    this.mobilePagesService.get(id).subscribe({
      next: (data) => {
        // 2. On met à jour le signal avec les données reçues
        this.mobilePage.set(data);
        if (data.publishedDate) {
          this.uiPublishedDate = new Date(data.publishedDate);
        }
      },
      error: (err) => {
        console.error('Erreur lors de la récupération de la page', err);
        this.goBack();
      }
    });
  }

  public goBack() {
    this.router.navigate(['cms/mobile/pages']);
  }

  public save() {
    const pageToSave = this.mobilePage();
    if (!pageToSave) return;

    this.isSaving.set(true);

    pageToSave.publishedDate = this.uiPublishedDate ? this.uiPublishedDate.getTime() : undefined;

    this.mobilePagesService.save(pageToSave).subscribe({
      next: (updatedPage) => {
        this.isSaving.set(false);
        this.mobilePage.set(updatedPage);
      },
      error: (err) => {
        console.error('Erreur lors de la sauvegarde', err);
        this.isSaving.set(false);
      }
    });
  }

  public openEditor(index: number) {
    // On récupère le composant qui correspond à l'index cliqué
    const component = this.blockInstances.toArray()[index];

    if (component) {
      this.activeBlock.set(component.block());
      this.activeTemplate.set(component.editorTemplate());
      this.sidebarVisible.set(true);
    }
  }

  public openSidebar() {
    this.activeBlock.set(null);
    this.activeTemplate.set(null);
    this.sidebarVisible.set(true);
  }

  public closeSidebar() {
    this.sidebarVisible.set(false);
    this.activeBlock.set(null);
    this.activeTemplate.set(null);
  }

  protected scrollToIndex(blockId: string) {
    const element = document.getElementById('block-' + blockId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });

      element.style.borderColor = 'var(--p-primary-color)';
      setTimeout(() => {
        element.style.borderColor = 'var(--p-content-border-color)';
      }, 1500);
    }
  }

  public drop(event: CdkDragDrop<any[]>) {
    const blocks = this.mobilePage()?.blocks;
    if (blocks) {
      moveItemInArray(blocks, event.previousIndex, event.currentIndex);

      this.mobilePage.set({...this.mobilePage()!});
    }
  }

  public onOpenAddModal() {
    this.isAddModalVisible.set(true);
  }

  public onBlockAdded(newBlock: Block) {
    this.mobilePage.update(page => ({
      ...page,
      blocks: [...(page!.blocks || []), newBlock]
    }));

    const blockName: string = blockTemplates[newBlock.type]?.label || ''

    this.messageService.add({
      severity: 'success',
      summary: 'Bloc ajouté',
      detail: `Le bloc "${blockName}" a été ajouté à la fin de la page.`,
      life: 3000
    });
  }

  public deleteBlock(index: number) {
    const blocks = this.mobilePage()?.blocks;
    if (blocks) {
      blocks.splice(index, 1);
      this.mobilePage.set({...this.mobilePage()!});
    }
  }
}
