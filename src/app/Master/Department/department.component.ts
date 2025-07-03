import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DepartmentService } from 'src/app/core/Service/DepartmentService ';

@Component({
    selector: 'app-department',
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    templateUrl: './department.component.html',
    styleUrls: ['./department.component.scss'] // optional if you want to style it
})
export class DepartmentComponent implements OnInit {
  departmentForm!: FormGroup;
  isEditMode = false;
  departmentId!: number;

  // Sample departments for dropdown
  departments = [
    { id: 1, name: 'HR' },
    { id: 2, name: 'Finance' },
    { id: 3, name: 'Sales' }
  ];

  constructor(private fb: FormBuilder,
    private router: Router,
    private departmentService: DepartmentService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadParentDepartments();
    this.checkEditMode();
  }

  private initForm(): void {
    this.departmentForm = this.fb.group({
      departmentName: ['', Validators.required],
      underDepartment: [''],
    });
  }

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

  private checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.departmentId = Number(id);
    if (!isNaN(this.departmentId) && this.departmentId > 0) {
      this.isEditMode = true;
      this.loadDepartmentData(this.departmentId);
    }

  }

  private loadDepartmentData(id: number): void {
    this.departmentService.getDepartmentById(id).subscribe(
      (dep) => this.departmentForm.patchValue({
        departmentName: dep.departmentName,
        underDepartment: dep.underDepartment
      }),

      (error) => {
        console.error('Error fetching department data:', error);
        alert('Error fetching department data.');
      }
    );
  }

  onSubmit(): void {
    if (this.departmentForm.invalid) {
      this.departmentForm.markAllAsTouched();
      return;
    }

    if (this.isEditMode) {
      this.updateDepartment();
    } else {
      this.saveDepartment();
    }
  }

  saveDepartment(): void {
    if (this.departmentForm.valid) {
      const payload = this.departmentForm.value;

      this.departmentService.createDepartment(payload).subscribe({
        next: (response) => {
          console.log('Department created successfully:', response);
          this.router.navigate(['/Mainlayout/department/list']);
        },
        error: (err) => {
          console.error('Error creating department:', err);
          alert('Error occurred while creating the department. Please try again.');
        }
      });
    } else {
      this.departmentForm.markAllAsTouched();
    }
  }

  private updateDepartment(): void {
    this.departmentService.updateDepartment(this.departmentId, this.departmentForm.value).subscribe(
      () => this.router.navigate(['/Mainlayout/department/list']),
      (error) => {
        console.error('Error updating department:', error);
        alert('Error updating department.');
      }
    );
  }

  clearForm(): void {
    this.departmentForm.reset();
  }

  closeForm(): void {
    this.router.navigate(['/departmenylist']);
  }

  goBack(): void {
    this.router.navigate(['/Mainlayout/department/list']);
  }
}
