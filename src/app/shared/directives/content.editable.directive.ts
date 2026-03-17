import {Directive, model, HostListener, ElementRef, effect, input} from '@angular/core';

@Directive({
  selector: '[appContentEditable]',
  standalone: true,
  host: {
    '[attr.spellcheck]': 'spellcheck()',
    'contenteditable': 'true',
    'class': 'outline-none' // Bonus : retire la bordure bleue dégueulasse au focus
  }
})
export class ContentEditableDirective {
  appContentEditable = model.required<string | undefined>();
  spellcheck = input<boolean | string>(false);

  constructor(private el: ElementRef<HTMLElement>) {
    effect(() => {
      const value = this.appContentEditable();
      if (this.el.nativeElement.innerText !== value) {
        this.el.nativeElement.innerText = value || '';
      }
    });
  }

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const el = event.target as HTMLElement;
    this.appContentEditable.set(el.innerText);
  }

  @HostListener('click', ['$event'])
  onClick(event: Event) {
    event.stopPropagation();
  }
}
