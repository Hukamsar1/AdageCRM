import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Designation } from 'src/app/core/interface/Ideignation';
import { DesignationService } from 'src/app/core/Service/degnationService';


@Component({
    selector: 'app-designation',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './designation.component.html',
    styleUrls: ['./designation.component.scss']
})
export class DesignationComponent {
designationForm: FormGroup;
  //departments: any[] = []; // Populate this with your departments data
 // reportToList: any[] = []; // Populate this with reporting persons data
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private designationService: DesignationService
  ) {
    this.designationForm = this.fb.group({
      designationName: ['', Validators.required],
      departmentId: ['', Validators.required],
      reportToId: ['']
    });
  }

  departments = [
  { id: 1, name: 'Human Resources' },
  { id: 2, name: 'Information Technology' },
  { id: 3, name: 'Finance' },
  { id: 4, name: 'Marketing' },
  { id: 5, name: 'Operations' }
];

reportToList = [
  { id: 101, name: 'John Smith', designation: 'Director' },
  { id: 102, name: 'Sarah Johnson', designation: 'Senior Manager' },
  { id: 103, name: 'Michael Brown', designation: 'Department Head' },
  { id: 104, name: 'Emily Davis', designation: 'Team Lead' }
];

  ngOnInit(): void {
    this.loadDepartments();
    this.loadReportToList();
  }

  loadDepartments(): void {
    // Implement your department loading logic
  }

  loadReportToList(): void {
    // Implement your reporting persons loading logic
  }

  onSubmit(): void {
    if (this.designationForm.valid) {
      this.isLoading = true;
      
      // Prepare the data to match your Designation interface
      const formData: Designation = {
        designationName: this.designationForm.value.designationName,
        departmentId: this.designationForm.value.departmentId,
        departmentName: this.getDepartmentName(this.designationForm.value.departmentId),
        reportToId: this.designationForm.value.reportToId,
        reportTo: this.getReportToName(this.designationForm.value.reportToId)
      };

      this.designationService.saveDesignation(formData).subscribe({
        next: (response) => {
          this.isLoading = false;
          // Handle success (show toast, reset form, etc.)
          console.log('Designation saved successfully', response);
          this.designationForm.reset();
        },
        error: (error) => {
          this.isLoading = false;
          // Handle error (show error message)
          console.error('Error saving designation', error);
        }
      });
    } else {
      // Mark all fields as touched to show validation messages
      this.markFormGroupTouched(this.designationForm);
    }
  }

// Add this method to your DesignationComponent class
showError(controlName: string): boolean {
  const control = this.designationForm.get(controlName);
  return control ? control.invalid && (control.touched || control.dirty) : false;
}

  onClear(): void {
    this.designationForm.reset();
  }

  private getDepartmentName(departmentId: number): string {
    const dept = this.departments.find(d => d.id === departmentId);
    return dept ? dept.name : '';
  }

  private getReportToName(reportToId: number): string {
    const person = this.reportToList.find(p => p.id === reportToId);
    return person ? person.name : '';
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
