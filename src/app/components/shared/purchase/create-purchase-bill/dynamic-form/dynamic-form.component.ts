import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.css']
})
export class DynamicFormComponent {

  dynamicForm !: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.dynamicForm = this.formBuilder.group({
      fields: this.formBuilder.array([])
    });
  }

  get fieldControls() {
    return (this.dynamicForm.get('fields') as FormArray).controls;
  }

  addField() {
    const fieldArray = this.dynamicForm.get('fields') as FormArray;
    fieldArray.push(this.formBuilder.group({
      fieldName: '',
      amount: 0,
      taxAmount: 0
    }));
  }

  removeField(index: number) {
    const fieldArray = this.dynamicForm.get('fields') as FormArray;
    fieldArray.removeAt(index);
  }

  calculateTax(index: number) {
    const fieldArray = this.dynamicForm.get('fields') as FormArray;
    const fieldGroup = fieldArray.at(index) as FormGroup;
    const amount = fieldGroup.get('amount')?.value;
    const taxAmount = amount * 0.1; // Calculate tax based on your logic
    fieldGroup.patchValue({ taxAmount });
  }

  submitForm() {
    // Handle form submission
    console.log(this.dynamicForm.value);
  }
}
