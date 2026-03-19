import {Component, inject, signal} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ControlValueAccessor, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {DatePickerModule} from "primeng/datepicker";
import {ButtonModule} from "primeng/button";
import {JobTypeStore} from "../../data-access/job-types.store";
import {Select} from "primeng/select";

@Component({
  selector: 'app-job-type-select',
  templateUrl: "./job-type-select.component.html",
  styleUrls: ["./job-type-select.component.scss"],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    DatePickerModule,
    ButtonModule,
    Select,
    FormsModule
  ]
})
export class JobTypeSelectComponent implements ControlValueAccessor {
  readonly store = inject(JobTypeStore);

  value = signal<string | null>(null);
  isDisabled = signal<boolean>(false);

  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(val: string | null): void {
    this.value.set(val);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  onValueChange(newVal: string) {
    this.value.set(newVal);
    this.onChange(newVal);
  }
}
