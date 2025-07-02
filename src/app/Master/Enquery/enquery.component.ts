import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EnquirySource } from 'src/app/core/interface/IEmployee';
import { EmployeeService } from 'src/app/core/Service/EmployeeService';

@Component({
    selector: 'app-enquirysource',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './enquery.component.html',
    styleUrls: ['./enquery.component.scss']
})
export class EnquirySourceFormComponent implements OnInit {
    form!: FormGroup;
    isEdit = false;
    id?: number;
    isLoading = false;
    isEditMode = false;
    enquirySourceId!: number;

    constructor(
        private fb: FormBuilder,
        private enquirySourceService: EmployeeService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.form = this.fb.group({
            enquirySourceName: ['', Validators.required]
        });

        this.id = Number(this.route.snapshot.paramMap.get('id'));
        if (this.id) {
            this.isEdit = true;
            this.checkEditMode();
        }
    }

    private checkEditMode(): void {
        this.route.paramMap.subscribe(params => {
            const id = params.get('id');
            if (id) {
                this.isEditMode = true;
                this.enquirySourceId = +id;
                this.loadEnqueryData(this.enquirySourceId);
            }
        });
    }

    private loadEnqueryData(id: number): void {
        this.isLoading = true;
        this.enquirySourceService.getEnquerySourceById(id).subscribe({
            next: (enquery) => {
                this.form.patchValue({
                    enquirySourceName: enquery.enquirySourceName, // Ensure this matches API response
                });
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Error loading Enquery:', error);
                this.isLoading = false;
                // Optional: Show error to user
            }
        });
    }

    onSubmit() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const name = this.form.get('enquirySourceName')?.value.trim();

        if (!name) {
            alert('Name is required');
            return;
        }

        this.enquirySourceService.checkDuplicateEnquirySource(name, this.id ?? 0).subscribe({
            next: (isDuplicate) => {
                if (isDuplicate) {
                    alert('This enquiry source already exists. Please choose another.');
                    return;
                }

                // Proceed if no duplicate
                this.saveEnquirySource();
            },
            error: () => {
                this.showError('Error checking duplicate enquiry source');
            }
        });
    }

    private saveEnquirySource() {
        const data: EnquirySource = this.form.value;

        if (this.isEdit) {
            this.enquirySourceService.update(this.id!, data).subscribe({
                next: () => {
                    this.form.reset();
                    this.showSuccess('Enquiry Source updated successfully!');
                    this.router.navigate(['/enquiry-source-list']);
                },
                error: (error) => {
                    this.showError(error.error?.message || 'Error updating Enquiry Source');
                }
            });
        } else {
            this.enquirySourceService.EnquerySourcecreate(data).subscribe({
                next: () => {
                    this.showSuccess('Enquiry Source created successfully!');
                    this.router.navigate(['/enquiry-source-list']);
                },
                error: (err) => {
                    this.showError('Error creating Enquiry Source');
                }
            });
        }
    }


    private showSuccess(message: string): void {
        alert(message);
    }

    private showError(message: string): void {
        alert(message);
    }
    goBack(): void {
        this.router.navigate(['/Mainlayout/enquiry-list']);

    }
}
