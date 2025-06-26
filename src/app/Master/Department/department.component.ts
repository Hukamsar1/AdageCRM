import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
    standalone: true,
    selector: 'app-department',
    imports: [CommonModule, ReactiveFormsModule,RouterModule],
    templateUrl: './department.component.html',
    styleUrls: ['./department.component.scss'] // optional if you want to style it
})
export class DepartmentComponent implements OnInit {
    // Reactive form for department
    departmentForm!: FormGroup;

    // Sample departments for dropdown
    departments = [
        { id: 1, name: 'HR' },
        { id: 2, name: 'Finance' },
        { id: 3, name: 'Sales' }
    ];

    constructor(private fb: FormBuilder, private router: Router) {

    }
    ngOnInit(): void {
    this.initializeForm();
    this.loadParentDepartments(); // Load departments for the 'Under' dropdown
  }

  // Placeholder method to load parent departments (e.g., from an API)
  loadParentDepartments(): void {
    // In a real application, you would fetch this from an API service
    // For demonstration, let's mock some data:
    this.departments = [
      { id: 1, name: 'Management' },
      { id: 2, name: 'Sales' },
      { id: 3, name: 'Marketing' },
      { id: 4, name: 'Human Resources' }
    ];
  }

   initializeForm(): void {
    this.departmentForm = this.fb.group({
      departmentName: ['', Validators.required], // Department Name, required
      underDepartment: [''] // Parent Department (optional, hence no Validators.required here)
    });
  }

    // Called on form submit
   // Handles the form submission
  onSubmit(): void {
    if (this.departmentForm.valid) {
      console.log('Form Submitted!', this.departmentForm.value);
      // Here you would typically send this data to a backend service
      // Example: this.departmentService.createDepartment(this.departmentForm.value).subscribe(response => {
      //   console.log('Department created successfully', response);
      //   this.router.navigate(['/departments-list']); // Navigate to a list page after success
      // });
      alert('Department data: ' + JSON.stringify(this.departmentForm.value)); // For demonstration
      this.departmentForm.reset(); // Optionally reset form after successful submission
    } else {
      console.log('Form is invalid. Please fill in all required fields.');
      // Optionally mark all fields as touched to show validation errors immediately
      this.departmentForm.markAllAsTouched();
    }
  }

  // Clears the form fields
  clearForm(): void {
    this.departmentForm.reset(); // Resets all form controls to their initial values
  }

  // Handles closing the form (e.g., navigate back)
  closeForm(): void {
    this.router.navigate(['/departmenylist']); // Navigate back to the list page
  }

  // Handles the 'Back' button click
  goBack(): void {
    this.router.navigate(['/Mainlayout/department/list']);

  }
}
