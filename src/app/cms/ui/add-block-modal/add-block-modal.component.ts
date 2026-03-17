import {Component, input, model, output} from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import {BlockFactory, blockTemplates} from "../../data-access/block-factory";
import {Block} from "../../data-access/mobile-pages.model";

@Component({
  selector: 'app-add-block-modal',
  standalone: true,
  imports: [DialogModule],
  templateUrl: './add-block-modal.component.html',
  styleUrls: ['./add-block-modal.component.scss']
})
export class AddBlockModalComponent {
  visible = model<boolean>(false);
  blockAdded = output<Block>();
  closeOnAdd = input<boolean>(true);

  templatesArray = Object.entries(blockTemplates).map(([type, data]) => ({
    type,
    ...data
  }));

  selectBlock(type: string) {
    const newBlock = BlockFactory.create(type);

    this.blockAdded.emit(newBlock);

    if (this.closeOnAdd()) {
      this.visible.set(false);
    }
  }
}
