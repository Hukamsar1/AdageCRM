import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LeadService } from 'src/app/core/Service/LeadService';
import { OrderService } from 'src/app/core/Service/OrderService ';
import { PaymentService } from 'src/app/core/Service/PaymentService';
import { TargetIncentiveService } from 'src/app/core/Service/targetIncentiveService';

@Component({
    selector: 'app-targetIncentive-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './targetIncentive.component.html',
    styleUrls: ['./targetIncentive.component.scss']
})
export class TargrtIncentiveComponent implements OnInit {
    TargetIncentiveForm!: FormGroup;
    isEditMode = false;
    loading = true;
    targetIncentiveId!: number;
    id?: number;

    // Dropdown Options
    periodOptions = ['Monthly', 'Daterange'];
    weekOptions = ['1st week', '2nd week', '3rd week', '4th week'];
    monthOptions = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    targetTypeOptions = ['Amount Based', 'Number Based'];
    incentiveTypeOptions = ['Amount', 'Percentage'];
    unitTypeOptions = ['Per Unit', 'Whole'];
    constructor(
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private targetIncentiveService: TargetIncentiveService,
        private paymentService: PaymentService
    ) {
    }

    ngOnInit(): void {
        this.FormCreate();
        // this.checkEditMode();
        this.handlePeriodTimeChanges();
    }

    // private checkEditMode(): void {
    //     this.route.paramMap.subscribe(params => {
    //         const id = params.get('id');
    //         if (id) {
    //             this.isEdit = true;
    //             this.paymentId = +id;
    //             this.PatchPaymentData(this.paymentId);
    //         }
    //     });
    // }

    FormCreate() {
        this.TargetIncentiveForm = this.fb.group({
            periodTime: ['', Validators.required],
            month: [''],         // 👈 NEW CONTROL
            week: [''],
            fromDate: [''],
            toDate: [''],

            targetType: ['', Validators.required],
            targetValue: ['', Validators.required],

            incentiveType: ['', Validators.required],
            incentiveValue: ['', Validators.required],

            unitType: ['', Validators.required],
            ActionType: [''],
            createdDate: [''],
            isUpdated: [''],
            isDeleted: [false],
        });
    }

    // private PatchPaymentData(id: number): void {
    //     this.loading = true;
    //     this.paymentService.getPaymentById(id).subscribe({
    //         next: (payment) => {
    //             console.log('Payment loaded:', payment);

    //             if (payment.ledger && !this.Ladgers.includes(payment.ledger)) {
    //                 this.Ladgers.push(payment.ledger);
    //             }

    //             this.paymentForm.patchValue({
    //                 paymentId: payment.paymentId,
    //                 customerId: payment.leadId,
    //                 Date: payment.date,
    //                 voucherno: payment.voucherno,
    //                 Ledger: payment.ledger ?? '',
    //                 ModeofPayment: payment.modeofPayment ?? '',
    //                 amount: payment.amount,
    //                 remark: payment.remark ?? ''
    //             });
    //             this.loading = false;
    //         },
    //         error: (error) => {
    //             console.error('Error loading payment:', error);
    //             this.loading = false;
    //         }
    //     });

    // }

    handlePeriodTimeChanges() {
        this.TargetIncentiveForm.get('periodTime')?.valueChanges.subscribe(value => {
            if (value === 'Monthly') {
                this.TargetIncentiveForm.patchValue({
                    fromDate: '',
                    toDate: ''
                });
            } else if (value === 'Daterange') {
                this.TargetIncentiveForm.patchValue({
                    month: '',
                    week: ''
                });
            } else {
                this.TargetIncentiveForm.patchValue({
                    month: '',
                    week: '',
                    fromDate: '',
                    toDate: ''
                });
            }
        });
    }

    get periodTime() {
        return this.TargetIncentiveForm.get('periodTime')?.value;
    }

    get targetType() {
        return this.TargetIncentiveForm.get('targetType')?.value;
    }

    get incentiveType() {
        return this.TargetIncentiveForm.get('incentiveType')?.value;
    }
    get month() {
        return this.TargetIncentiveForm.get('month')?.value;
    }


    private formatDateForInput(date: Date): string {
        return date.toISOString().slice(0, 10);
    }

    onTargetIncentiveSubmit(): void {
        if (this.TargetIncentiveForm.invalid) {
            this.TargetIncentiveForm.markAllAsTouched();
            return;
        }
        console.log('Form Data:', this.TargetIncentiveForm.value);
        const payload = this.TargetIncentiveForm.getRawValue();
        payload.createdDate = new Date().toISOString();
        payload.isUpdated = new Date().toISOString();
        payload.isDeleted = false;
        payload.ActionType = this.isEditMode ? 'update' : 'create';

        if (this.isEditMode && this.targetIncentiveId !== null) {
            this.paymentService.updatePayment(this.targetIncentiveId, payload).subscribe(() => {
                alert('Payment updated successfully');
                // this.paymentForm.reset();
                // this.router.navigate(['/Mainlayout/payment-list']);
            });
        } else {
            this.targetIncentiveService.addTargetIncentive(payload).subscribe(() => {
                alert('Payment saved successfully');
                this.TargetIncentiveForm.reset();
                this.router.navigate(['/Mainlayout/payment-list']);
            });
        }
    }

    clearForm() {
        this.TargetIncentiveForm.reset();
    }

    closeForm() {
        this.router.navigate(['/Mainlayout/targrtIncentive-list']);
    }

    goBack() {
        this.router.navigate(['/Mainlayout/targrtIncentive-list']);
    }

    private showSuccess(message: string): void {
        alert(message);
    }

    private showError(message: string): void {
        alert(message);
    }
}