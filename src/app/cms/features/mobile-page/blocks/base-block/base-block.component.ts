import {Component, input, viewChild, TemplateRef, model} from '@angular/core';
import {Block} from "../../../../data-access/mobile-pages.model";

@Component({ template: '' })
export abstract class BaseBlockComponent<T = Block> {
  block = model.required<T>();

  editorTemplate = viewChild.required<TemplateRef<any>>('editor');
}
