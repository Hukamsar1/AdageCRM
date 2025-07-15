import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LeadService } from 'src/app/core/Service/LeadService';
import { OrderService } from 'src/app/core/Service/OrderService ';
import { PaymentService } from 'src/app/core/Service/PaymentService';

@Component({
    selector: 'app-payment-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
    paymentForm!: FormGroup;
    isEdit = false;
    loading = true;
    paymentId!: number;
    isEditMode = false;
    id?: number;
    showAmountSection = false;
    Ladgers: string[] = [];
    PaymentsMode = ['UPI', 'Google Pay', 'Phone Pay', 'Paytm', 'Cash'];
    selectedValue: string = '';

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private leadservice: LeadService,
        private orderService: OrderService,
        private route: ActivatedRoute,
        private paymentService: PaymentService
    ) {
    }

    ngOnInit(): void {
        this.FormCreate();
        this.checkEditMode();
        this.route.queryParams.subscribe(params => {
            const LeadId = +params['customerId']; // 👈 convert to number
            const customerName = params['customerName'];
            if (LeadId && customerName) {
                this.Ladgers = [customerName];
                this.paymentForm.get('Ledger')?.setValue(customerName);
                this.paymentForm.get('customerId')?.setValue(LeadId);
            }
        });

    }

    private checkEditMode(): void {
        this.route.paramMap.subscribe(params => {
            const id = params.get('id');
            if (id) {
                this.isEdit = true;
                this.paymentId = +id;
                this.PatchPaymentData(this.paymentId);
            }
        });
    }

    FormCreate() {
        this.paymentForm = this.fb.group({
           // paymentId: [''],
            customerId: [''],  // ADD THIS
            voucherno: [{ value: this.generatedVoucherNo(), disabled: true }],
            date: [this.formatDateForInput(new Date()), Validators.required],
            Ledger: ['', Validators.required],
            ModeofPayment: ['', Validators.required],
            amount: [null, [Validators.required]],
            remark: [''],
            ActionType: [''],
            createdDate: [''],
            isUpdated: [''],
            isDeleted: [false],
        });

    }

    private PatchPaymentData(id: number): void {
        this.loading = true;
        this.paymentService.getPaymentById(id).subscribe({
            next: (payment) => {
                console.log('Payment loaded:', payment);

                if (payment.ledger && !this.Ladgers.includes(payment.ledger)) {
                    this.Ladgers.push(payment.ledger);
                }

                this.paymentForm.patchValue({
                    paymentId: payment.paymentId,
                    customerId: payment.leadId,
                    Date: payment.date,
                    voucherno: payment.voucherno,
                    Ledger: payment.ledger ?? '',
                    ModeofPayment: payment.modeofPayment ?? '',
                    amount: payment.amount,
                    remark: payment.remark ?? ''
                });
                this.loading = false;
            },
            error: (error) => {
                console.error('Error loading payment:', error);
                this.loading = false;
            }
        });

    }

    onCustomerSelected(event: any) {
        const value = event.target.value;
        if (value) {
            const [id, name] = value.split('|');
            this.paymentForm.get('customerId')?.setValue(+id);
            this.paymentForm.get('ledger')?.setValue(name);
        } else {
            this.paymentForm.get('customerId')?.setValue(null);
            this.paymentForm.get('ledger')?.setValue('');
        }
    }

    private formatDateForInput(date: Date): string {
        return date.toISOString().slice(0, 10);
    }


    generatedVoucherNo(): string {
        const date = new Date();
        const yyyymmdd = date.toISOString().slice(0, 10).replace(/-/g, '');
        const random = Math.floor(100 + Math.random() * 900);
        return `VN${yyyymmdd}${random}`;
    }


    onPaymentSubmit(): void {
        if (this.paymentForm.invalid) {
            this.paymentForm.markAllAsTouched();
            return;
        }

        const payment = this.paymentForm.getRawValue();
        payment.createdDate = new Date().toISOString();
        payment.isUpdated = new Date().toISOString();
        payment.isDeleted = false;
        payment.ActionType = this.isEditMode ? 'update' : 'create';

        if (this.isEdit && this.paymentId !== null) {
            payment.paymentId = this.paymentId;
            this.paymentService.updatePayment(this.paymentId, payment).subscribe(() => {
                alert('Payment updated successfully');
               // this.paymentForm.reset();
               // this.router.navigate(['/Mainlayout/payment-list']);
            });
        } else {
            this.paymentService.addPayment(payment).subscribe(() => {
                alert('Payment saved successfully');
                this.paymentForm.reset();
                this.router.navigate(['/Mainlayout/payment-list']);
            });
        }
    }

    // onPaymentSubmit() {
    //     if (this.paymentForm.invalid) {
    //         this.paymentForm.markAllAsTouched();
    //         return;
    //     }

    //     const payload = this.paymentForm.getRawValue();
    //     payload.ActionType = this.isEdit ? 'update' : 'create';
    //     payload.createdDate = new Date().toISOString();
    //     payload.isUpdated = new Date().toISOString();
    //     payload.isDeleted = false;

    //     if (this.isEdit) {
    //         // use the same orderId you stored
    //         this.orderService.updateOrder(this.orderId, payload).subscribe({
    //             next: () => {
    //                 this.showSuccess('Order updated successfully!');
    //                 this.router.navigate(['/Mainlayout/order-list']);
    //             },
    //             error: err => this.showError(err.error?.message || 'Error updating order')
    //         });
    //     } else {
    //         this.orderService.saveOrder(payload).subscribe({
    //             next: () => {
    //                 this.showSuccess('Order created successfully!');
    //                 this.router.navigate(['/Mainlayout/order-list']);
    //             },
    //             error: err => this.showError('Failed to save order.')
    //         });
    //     }
    // }

    // private UpdateSaveOrder() {
    //     if (this.orderForm.valid) {
    //         const orderData = this.orderForm.getRawValue();
    //         orderData.ActionType = this.isEdit ? 'update' : 'create';
    //         orderData.createdDate = new Date().toISOString();
    //         orderData.isUpdated = new Date().toISOString();
    //         orderData.isDeleted = false;

    //         if (this.isEdit) {
    //             this.orderService.updateOrder(this.id!, orderData).subscribe({
    //                 next: () => {
    //                     this.orderForm.reset();
    //                     this.showSuccess('Order updated successfully!');
    //                     this.router.navigate(['/product-list']);
    //                 },
    //                 error: (error) => {
    //                     console.error('Error details:', error);
    //                     this.showError(error.error?.message || 'Error updating Order');
    //                 }
    //             });
    //         } else {
    //             this.orderService.saveOrder(orderData).subscribe({
    //                 next: (response) => {
    //                     this.showSuccess('Order saved successfully!');
    //                     console.log('API Response:', response);
    //                     this.clearForm();
    //                     this.goBack();
    //                 },
    //                 error: (error) => {
    //                     this.showError('Failed to save order.');
    //                     console.error('API Error:', error);
    //                 }
    //             });
    //         }
    //     } else {
    //         this.showError('Please fill all required fields correctly.');
    //     }
    // }



    clearForm() {
        this.paymentForm.reset();
        this.showAmountSection = false;
    }

    closeForm() {
        this.router.navigate(['/Mainlayout/payment-list']);
        this.showAmountSection = false;
    }

    goBack() {
        this.router.navigate(['/Mainlayout/payment-list']);
    }

    private showSuccess(message: string): void {
        alert(message);
    }

    private showError(message: string): void {
        alert(message);
    }
}


