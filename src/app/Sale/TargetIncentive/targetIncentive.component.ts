import { CommonModule, NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from 'src/app/core/Service/PaymentService';
import { TargetIncentiveService } from 'src/app/core/Service/targetIncentiveService';

@Component({
    selector: 'app-targetIncentive-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormsModule, NgIf, NgFor,],
    templateUrl: './targetIncentive.component.html',
    styleUrls: ['./targetIncentive.component.scss']
})
export class TargrtIncentiveComponent implements OnInit {
    TargetIncentiveForm!: FormGroup;
    isEditMode = false;
    loading = true;
    targetIncentiveId!: number;
    id?: number;

    periodOptions = ['Monthly', 'Quarterly', 'Yearly'];
    monthOptions = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    quarterOptions = [
        'April-June',
        'July-September',
        'October-December',
        'January-March'
    ];

    yearOptions = ['2025-26', '2026-27'];

    targetTypeOptions = ['Amount Wise', 'Number Wise'];
    incentiveTypeOptions = ['Amount', 'Percentage'];
    unitTypeOptions = ['Per Unit', 'Whole'];

   selectedMonthWeeks: { label: string, range: string, value: number | null, calculatedValue: number }[] = [];

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private targetIncentiveService: TargetIncentiveService,
        private paymentService: PaymentService,
          private cdr: ChangeDetectorRef

    ) {
    }

    ngOnInit(): void {
        this.createForm();
        // this.checkEditMode();
        this.handlePeriodTimeChanges();
        this.TargetIncentiveForm.get('targetValue')?.valueChanges.subscribe(() => {
  this.updateCalculatedWeekValues();
});

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

    createForm() {
        this.TargetIncentiveForm = this.fb.group({
            periodTime: ['', Validators.required],
            month: [''],
            quarter: [''],
            year: [''],
            targetType: ['', Validators.required],
            targetValue: ['', Validators.required],
           // incentiveType: ['', Validators.required],
           // incentiveValue: ['', Validators.required],
          //  unitType: ['', Validators.required],
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

    // For displaying selected PeriodTime
    get periodTime() {
        return this.TargetIncentiveForm.get('periodTime')?.value;
    }

    get targetType() {
        return this.TargetIncentiveForm.get('targetType')?.value;
    }

    get incentiveType() {
        return this.TargetIncentiveForm.get('incentiveType')?.value;
    }

    handlePeriodTimeChanges() {
        this.TargetIncentiveForm.get('periodTime')?.valueChanges.subscribe(value => {
            this.TargetIncentiveForm.patchValue({
                month: '',
                quarter: '',
                year: ''
            });
            this.selectedMonthWeeks = [];
        });
    }

    onMonthChange(event: any) {
        const month = event.target.value;
        if (month) {
            this.generateWeeksForMonth();
        } else {
            this.selectedMonthWeeks = [];
        }
    }
private updateCalculatedWeekValues(): void {
  const targetAmount = +this.TargetIncentiveForm.get('targetValue')?.value || 0;

  this.selectedMonthWeeks = this.selectedMonthWeeks.map(week => {
    const percentage = week.value ?? 0;
    const calculatedValue = Math.round((targetAmount * percentage) / 100);
    return { ...week, calculatedValue };
  });

  this.cdr.detectChanges();
}

generateWeeksForMonth() {
  this.selectedMonthWeeks = [
    { label: 'Week 1', range: '01-07-25 to 07-07-25', value: 20, calculatedValue: 0 },
    { label: 'Week 2', range: '08-07-25 to 15-07-25', value: 25, calculatedValue: 0 },
    { label: 'Week 3', range: '16-07-25 to 23-07-25', value: 30, calculatedValue: 0 },
    { label: 'Week 4', range: '24-07-25 to 31-07-25', value: 25, calculatedValue: 0 }
  ];

  this.updateCalculatedWeekValues();
}

    onTargetIncentiveSubmit(): void {
        if (this.TargetIncentiveForm.invalid) {
            this.TargetIncentiveForm.markAllAsTouched();
            return;
        }

        const payload = this.TargetIncentiveForm.getRawValue();
        payload.weekTargets = this.selectedMonthWeeks;  // Attach week details

        payload.createdDate = new Date().toISOString();
        payload.isUpdated = new Date().toISOString();
        payload.isDeleted = false;
        payload.ActionType = this.isEditMode ? 'update' : 'create';

        console.log('Final Payload:', payload);

        // Call Service
        if (this.isEditMode && this.targetIncentiveId !== null) {
            this.paymentService.updatePayment(this.targetIncentiveId, payload).subscribe(() => {
                alert('Payment updated successfully');
                // this.paymentForm.reset();
                // this.router.navigate(['/Mainlayout/payment-list']);
            });
        } else {
            this.targetIncentiveService.createTargetIncentive(payload).subscribe(() => {
                alert('Target Incentive saved successfully');
                this.clearForm();
              //  this.router.navigate(['/Mainlayout/targrtIncentive-list']);
            });
        }
    }

    clearForm() {
        this.TargetIncentiveForm.reset();
        this.selectedMonthWeeks = [];
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