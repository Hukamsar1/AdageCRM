import { CommonModule, NgFor, NgForOf, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from 'src/app/core/Service/PaymentService';
import { TargetIncentiveService } from 'src/app/core/Service/targetIncentiveService';

@Component({
    selector: 'app-targetIncentive-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormsModule],
    templateUrl: './targetIncentive.component.html',
    styleUrls: ['./targetIncentive.component.scss']
})
export class TargrtIncentiveComponent implements OnInit {
    TargetIncentiveForm!: FormGroup;
    isEditMode = false;
    loading = true;
    targetIncentiveId!: number;
    Zones : any[] = [];
    Employees : any[] = [];
    periodOptions = ['Monthly', 'Quarterly', 'Yearly'];
    monthOptions = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    quarterOptions = ['April-June', 'July-September', 'October-December', 'January-March'];
    yearOptions = ['2025-26', '2026-27'];
    targetTypeOptions = ['Amount Wise', 'Number Wise'];

    selectedQuarterMonths: { month: string, percentage: number, calculatedValue: number }[] = [];
    selectedMonthWeeks: { label: string, range: string, value: number | null, calculatedValue: number }[] = [];
    yearlyBreakdown: { month: string, percentage: number, calculatedValue: number }[] = [];

    initializeYearlyBreakdown(): void {
        this.yearlyBreakdown = [
            { month: 'April', percentage: 0, calculatedValue: 0 },
            { month: 'May', percentage: 0, calculatedValue: 0 },
            { month: 'June', percentage: 0, calculatedValue: 0 },
            { month: 'July', percentage: 0, calculatedValue: 0 },
            { month: 'August', percentage: 0, calculatedValue: 0 },
            { month: 'September', percentage: 0, calculatedValue: 0 },
            { month: 'October', percentage: 0, calculatedValue: 0 },
            { month: 'November', percentage: 0, calculatedValue: 0 },
            { month: 'December', percentage: 0, calculatedValue: 0 },
            { month: 'January', percentage: 0, calculatedValue: 0 },
            { month: 'February', percentage: 0, calculatedValue: 0 },
            { month: 'March', percentage: 0, calculatedValue: 0 },
        ];
    }


    constructor(
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private targetIncentiveService: TargetIncentiveService,
        private paymentService: PaymentService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.createForm();
        this.handlePeriodTimeChanges();

        this.TargetIncentiveForm.get('targetValue')?.valueChanges.subscribe(() => {
            this.updateCalculatedWeekValues();

            if (this.periodTime === 'Quarterly') {
                this.updateQuarterCalculatedValues();
            } else if (this.periodTime === 'Yearly') {
                this.updateYearlyCalculatedValues();
            }
        });

        this.TargetIncentiveForm.get('targetValue')?.valueChanges.subscribe(() => {
            this.onTargetValueChange();
        });

        this.TargetIncentiveForm.get('quarter')?.valueChanges.subscribe(q => {
            if (this.periodTime === 'Quarterly') {
                this.onQuarterChange(q);
            }
        });

    }

    createForm() {
        this.TargetIncentiveForm = this.fb.group({
           // Zone:[''],
          //  employee:[''],
            periodTime: ['', Validators.required],
            month: [''],
            quarter: [''],
            year: [''],
            targetType: ['', Validators.required],
            targetValue: ['', Validators.required],
            ActionType: [''],
            createdDate: [''],
            isUpdated: [''],
            isDeleted: [false],
        });
    }

    get periodTime() {
        return this.TargetIncentiveForm.get('periodTime')?.value;
    }

    get targetType() {
        return this.TargetIncentiveForm.get('targetType')?.value;
    }

    onTargetValueChange(): void {
        if (this.periodTime === 'Yearly') {
            this.updateYearlyCalculatedValues();
        }
    }

    checkTotalYearlyPercentage(): number {
        return this.yearlyBreakdown.reduce((sum, item) => sum + (+item.percentage || 0), 0);
    }

    onYearlyPercentageChange(index: number, event: any): void {
        const inputValue = parseFloat(event.target.value) || 0;
        const totalTarget = +this.TargetIncentiveForm.get('targetValue')?.value || 0;

        this.yearlyBreakdown[index].percentage = inputValue;
        this.yearlyBreakdown[index].calculatedValue = parseFloat(((totalTarget * inputValue) / 100).toFixed(2));
    }

    handlePeriodTimeChanges() {
        this.TargetIncentiveForm.get('periodTime')?.valueChanges.subscribe(value => {
            this.TargetIncentiveForm.patchValue({ month: '', quarter: '', year: '' });
            this.selectedMonthWeeks = [];

            if (value === 'Yearly') {
                this.initializeYearlyBreakdown(); // only once!
                this.autoDistributeYearlyPercentages(); // new: distribute 100%
                this.updateYearlyCalculatedValues();
            }
        });
    }

    generateYearlyBreakdown(totalAmount: number): void {
        this.yearlyBreakdown = [];
        const months = [
            'April', 'May', 'June', 'July', 'August', 'September',
            'October', 'November', 'December', 'January', 'February', 'March'
        ];

        const basePercentage = parseFloat((100 / 12).toFixed(2)); // 8.33
        let totalSoFar = 0;

        for (let i = 0; i < months.length; i++) {
            let percentage = basePercentage;

            // Adjust last month to make total exactly 100%
            if (i === months.length - 1) {
                percentage = parseFloat((100 - totalSoFar).toFixed(2));
            } else {
                totalSoFar += percentage;
            }

            const calculatedValue = parseFloat(((percentage / 100) * totalAmount).toFixed(2));
            this.yearlyBreakdown.push({
                month: months[i],
                percentage: percentage,
                calculatedValue: calculatedValue
            });
        }
    }

    autoDistributeYearlyPercentages(): void {
        const equalPercent = +(100 / this.yearlyBreakdown.length).toFixed(2);
        this.yearlyBreakdown = this.yearlyBreakdown.map(month => ({
            ...month,
            percentage: equalPercent,
            calculatedValue: 0
        }));

        this.updateYearlyCalculatedValues();
    }

    onMonthChange(event: any) {
        const month = event.target.value;
        if (month) {
            this.generateWeeksForMonth();
        } else {
            this.selectedMonthWeeks = [];
        }
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

    updateYearlyCalculatedValues(): void {
        const totalTarget = +this.TargetIncentiveForm.get('targetValue')?.value || 0;

        this.yearlyBreakdown.forEach(item => {
            item.calculatedValue = +(totalTarget * item.percentage / 100).toFixed(2);

            // optional reverse sync
            if (totalTarget > 0) {
                item.percentage = parseFloat(((item.calculatedValue / totalTarget) * 100).toFixed(3));
            }
        });
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

    onQuarterChange(quarter: string) {
        const months = this.getQuarterMonths(quarter);
        const percentagePerMonth = 100 / months.length;

        this.selectedQuarterMonths = months.map(m => ({
            month: m,
            percentage: percentagePerMonth,
            calculatedValue: 0
        }));

        this.updateQuarterCalculatedValues();
    }

    getQuarterMonths(quarter: string): string[] {
        const mapping: { [key: string]: string[] } = {
            'April-June': ['April', 'May', 'June'],
            'July-September': ['July', 'August', 'September'],
            'October-December': ['October', 'November', 'December'],
            'January-March': ['January', 'February', 'March'],
        };
        return mapping[quarter] || [];
    }

    updateQuarterCalculatedValues() {
        const target = +this.TargetIncentiveForm.get('targetValue')?.value || 0;

        this.selectedQuarterMonths = this.selectedQuarterMonths.map(item => {
            const calculatedValue = Math.round((target * item.percentage) / 100);
            return { ...item, calculatedValue };
        });

        this.cdr.detectChanges();
    }

    onQuarterInputChange(index: number, event: Event): void {
        const inputElement = event.target as HTMLInputElement;
        const value = parseFloat(inputElement.value);

        if (!isNaN(value) && this.selectedQuarterMonths[index]) {
            this.selectedQuarterMonths[index].percentage = value;
            this.updateQuarterCalculatedValues();
        }
    }

    onYearlyInputChange(index: number, event: Event): void {
        const input = event.target as HTMLInputElement;
        const value = parseFloat(input.value);

        if (!isNaN(value)) {
            this.yearlyBreakdown[index].percentage = value;
            this.updateYearlyCalculatedValues();
        }
    }

    onYearlyCalculatedValueChange(index: number, event: Event): void {
        const input = event.target as HTMLInputElement;
        const value = parseFloat(input.value);

        if (!isNaN(value)) {
            this.yearlyBreakdown[index].calculatedValue = value;

            // Recalculate percentage based on this value
            const totalTarget = +this.TargetIncentiveForm.get('targetValue')?.value || 0;
            if (totalTarget > 0) {
                const percentage = +(value / totalTarget * 100).toFixed(2);
                this.yearlyBreakdown[index].percentage = percentage;
            }
        }
    }


    get totalQuarterPercentage(): number {
        return this.selectedQuarterMonths.reduce((sum, m) => sum + (m.percentage || 0), 0);
    }

getMonthNumber(monthName: string): number | null {
    const months: { [key: string]: number } = {
        January: 1, February: 2, March: 3, April: 4,
        May: 5, June: 6, July: 7, August: 8,
        September: 9, October: 10, November: 11, December: 12
    };
    return months[monthName] || null;
}


onTargetIncentiveSubmit(): void {
    if (this.TargetIncentiveForm.invalid) {
        this.TargetIncentiveForm.markAllAsTouched();
        return;
    }

    if (this.periodTime === 'Yearly') {
        const totalCalculatedValue = this.yearlyBreakdown.reduce(
            (sum, item) => sum + (+item.calculatedValue || 0), 0
        );
        const totalTarget = +this.TargetIncentiveForm.get('targetValue')?.value || 0;

        const difference = +(totalTarget - totalCalculatedValue).toFixed(2);
        if (Math.abs(difference) > 0.01) {
            const status = difference > 0 ? 'less' : 'more';
            alert(`Calculated total is ${Math.abs(difference)} ${status} than 100% of Target Value.`);
            return;
        }
    }

    const raw = this.TargetIncentiveForm.getRawValue();
    const payload: any = { ...raw };

    // Convert month name to number for backend compatibility
    payload.month = this.periodTime === 'Monthly' ? this.getMonthNumber(raw.month) : null;

    // Ensure year is a number
    payload.year = this.periodTime === 'Yearly' ? +raw.year || null : null;

    // Clean unused fields
    payload.quarter = this.periodTime === 'Quarterly' ? raw.quarter : null;

    payload.weekTargets = this.periodTime === 'Monthly' ? this.selectedMonthWeeks : [];
    payload.quarterTargetMonths = this.periodTime === 'Quarterly' ? this.selectedQuarterMonths : [];
    payload.yearlyTargetMonths = this.periodTime === 'Yearly' ? this.yearlyBreakdown : [];

    // Audit fields
    payload.createdDate = new Date().toISOString();
    payload.isUpdated = false;
    payload.isDeleted = false;
    payload.ActionType = this.isEditMode ? 'update' : 'create';

    console.log('Final Payload:', payload);

    if (this.isEditMode && this.targetIncentiveId !== null) {
        this.paymentService.updatePayment(this.targetIncentiveId, payload).subscribe(() => {
            alert('Payment updated successfully');
        });
    } else {
        this.targetIncentiveService.createTargetIncentive(payload).subscribe(() => {
            alert('Target Incentive saved successfully');
            this.clearForm();
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
}
