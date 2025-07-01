import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EnquirySource } from 'src/app/core/interface/IEmployee';
import { EmployeeService } from 'src/app/core/Service/EmployeeService';

@Component({
    selector: 'app-enquirysource',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule,],
    templateUrl: './enquery.component.html',
    styleUrls: ['./enquery.component.scss']
})
export class EnquirySourceFormComponent implements OnInit {
    form!: FormGroup;
    isEdit = false;
    id?: number;

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
            this.loadData();
        }
    }

    loadData() {
        this.enquirySourceService.getById(this.id!).subscribe({
            next: data => this.form.patchValue(data),
            error: err => console.error('Load failed', err)
        });
    }

    onSubmit() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const data: EnquirySource = this.form.value;

        if (this.isEdit) {
            this.enquirySourceService.update(this.id!, data).subscribe({
                next: () => this.router.navigate(['/enquiry-source-list']),
                error: err => console.error('Update failed', err)
            });
        } else {
            this.enquirySourceService.EnquerySourcecreate(data).subscribe({
                next: () => 
                    this.router.navigate(['/enquiry-source-list']),
                error: err => console.error('Create failed', err)
            });
        }
    }
}
