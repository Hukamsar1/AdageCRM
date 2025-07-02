import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Designation } from 'src/app/core/interface/Ideignation';
import { DesignationService } from 'src/app/core/Service/degnationService';

@Component({
    selector: 'app-designation',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './designation.component.html',
    styleUrls: ['./designation.component.scss']
})
export class DesignationComponent implements OnInit {
  designationForm: FormGroup;
  isEditMode = false;
  designationId!: number;
  isLoading = false;

   departments = [
    { id: 1, name: 'Human Resources' },
    { id: 2, name: 'Information Technology' },
    { id: 3, name: 'Finance' },
    { id: 4, name: 'Marketing' },
    { id: 5, name: 'Operations Management' },
    { id: 6, name: 'Accounts' },
    { id: 7, name: 'Sales' },
    { id: 8, name: 'Research and Development' },
    { id: 9, name: 'Customer Service' },
    { id: 10, name: 'Legal' },
    { id: 11, name: 'Administration' },
    { id: 12, name: 'Public Relations' },
    { id: 13, name: 'Purchasing' },
    { id: 14, name: 'Logistics' },
    { id: 15, name: 'Facilities Management' },
    { id: 16, name: 'Procurement' },
    { id: 17, name: 'Project Management' },
    { id: 18, name: 'Risk Management' },
    { id: 19, name: 'Compliance' },
    { id: 20, name: 'Customer Relations' },
    { id: 21, name: 'Support' },
    { id: 22, name: 'Training' },
    { id: 23, name: 'Engineering' },
    { id: 24, name: 'Design' },
    { id: 25, name: 'Quality Assurance' },
    { id: 26, name: 'Supply Chain' },
    { id: 27, name: 'Product Management' },
    { id: 28, name: 'Business Development' },
  ];

  reportToList = [
    { id: 101, name: 'John Smith', designation: 'Director' },
    { id: 102, name: 'Sarah Johnson', designation: 'Senior Manager' },
    { id: 103, name: 'Michael Brown', designation: 'Department Head' },
    { id: 104, name: 'Emily Davis', designation: 'Team Lead' }
  ];

  constructor(
    private fb: FormBuilder,
    private designationService: DesignationService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.designationForm = this.fb.group({
      designationName: ['', Validators.required],
      departmentId: ['', Validators.required],
      reportToId: ['']
    });
  }

   ngOnInit(): void {
    this.checkEditMode();
  }

  private checkEditMode(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.designationId = +id;
        this.loadDesignationData(this.designationId);
      }
    });
  }

  // loadDesignation(id: number): void {
  //   this.isLoading = true;
  //   this.designationService.getDesignationById(id).subscribe({
  //     next: (designation) => {
  //       this.designationForm.patchValue({
  //         designationName: designation.designationName,
  //         departmentId: designation.departmentId,
  //         reportToId: designation.reportToId
  //       });
  //       this.isLoading = false;
  //     },
  //     error: (error) => {
  //       console.error('Error loading designation:', error);
  //       this.isLoading = false;
  //     }
  //   });
  // }

   private loadDesignationData(id: number): void {
    this.isLoading = true;
    this.designationService.getDesignationById(id).subscribe({
      next: (designation) => {
        this.designationForm.patchValue({
          designationName: designation.designationName, // Ensure this matches API response
          departmentId: designation.departmentId,
          reportToId: designation.reportToId || null
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading designation:', error);
        this.isLoading = false;
        // Optional: Show error to user
      }
    });
  }

  onSubmit(): void {
    if (this.designationForm.invalid) {
      this.designationForm.markAllAsTouched();
      return;
    }

    const id = this.isEditMode ? this.designationId : 0;

    if (!this.designationForm.value.reportToId) {
      this.designationForm.patchValue({ reportToId: null });
    }

    const formData: Designation = {
      designationId: this.designationId,
      designationName: this.designationForm.value.designationName,
      departmentId: this.designationForm.value.departmentId,
      departmentName: this.getDepartmentName(this.designationForm.value.departmentId),
      reportToId: this.designationForm.value.reportToId,
      reportTo: this.getReportToName(this.designationForm.value.reportToId),
      actionType: this.isEditMode ? 'update' : 'create'
    };

    if (this.isEditMode && this.designationId) {
      this.updateDesignation(this.designationId, formData);
    } else {
      this.createDesignation(formData);
    }
  }

   createDesignation(designation: Designation): void {
    this.isLoading = true;
    this.designationService.saveDesignation(designation).subscribe({
      next: () => {
        this.router.navigate(['/Mainlayout/designation/list']);
      },
      error: (error) => {
        console.error('Error creating designation:', error);
        this.isLoading = false;
      }
    });
  }

  updateDesignation(id: number, designation: Designation): void {
    this.isLoading = true;
    this.designationService.updateDesignation(id, designation).subscribe({
      next: () => {
        this.router.navigate(['/Mainlayout/designation/list']);
      },
      error: (error) => {
        console.error('Error updating designation:', error);
        this.isLoading = false;
      }
    });
  }

  onClear(): void {
    this.designationForm.reset();
  }

  goBack(): void {
    this.router.navigate(['/Mainlayout/designation/list']);
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

  showError(controlName: string): boolean {
    const control = this.designationForm.get(controlName);
    return control ? control.invalid && (control.touched || control.dirty) : false;
  }
}