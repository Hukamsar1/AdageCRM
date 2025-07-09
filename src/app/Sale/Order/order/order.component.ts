import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LeadService } from 'src/app/core/Service/LeadService';
import { OrderService } from 'src/app/core/Service/OrderService ';
import { ProductService } from 'src/app/core/Service/productService';

@Component({
    selector: 'app-order-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './order.component.html',
    styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
    orderForm!: FormGroup;
    isEdit = false;
    loading = true;
    orderId!: number;
    id?: number;
    Customers: any[] = [];
    Products: any[] = [];
    selectedRate: number = 0;
    selectedTax: number = 0;
    showAmountSection = false;

    error: string | null = null;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private productService: ProductService,
        private leadservice: LeadService,
        private orderService: OrderService,
        private route: ActivatedRoute,
    ) { }

    ngOnInit(): void {
        this.FormCreate();
        this.loadProducts();
        this.loadCustomers();
        this.checkEditMode();

        // React to Product selection
        this.orderForm.get('product')?.valueChanges.subscribe(value => {
            const selected = this.Products.find(p => p.productName === value);
            if (selected) {
                this.selectedRate = selected.rate;
                this.selectedTax = selected.tax;
            } else {
                this.selectedRate = 0;
                this.selectedTax = 0;
            }
            this.showAmountSection = false;
            this.orderForm.patchValue({ amount: '', discount: '' });
        });

        // React to Quantity input
        this.orderForm.get('quantity')?.valueChanges.subscribe(() => {
            this.calculateAmount();
        });

        // React to Discount input
        this.orderForm.get('discount')?.valueChanges.subscribe(() => {
            this.calculateAmount();
        });
    }

    private checkEditMode(): void {
        this.route.paramMap.subscribe(params => {
            const id = params.get('id');
            if (id) {
                this.isEdit = true;
                this.orderId = +id;
                this.PatchOrderData(this.orderId);
            }
        });
    }

    private PatchOrderData(id: number): void {
        this.loading = true;
        this.orderService.getOrderById(id).subscribe({
            next: (order) => {
                this.orderForm.patchValue({
                    customer: order.customer,
                    product: order.product,
                    quantity: order.quantity,
                    discount: order.discount,
                    amount: order.amount
                });
                this.loading = false;
            },
            error: (error) => {
                console.error('Error loading Product:', error);
                this.loading = false;
            }
        });
    }

    FormCreate() {
    this.orderForm = this.fb.group({
      customer:    ['', Validators.required],
      product:     ['', Validators.required],
      quantity:    [null, [Validators.required, Validators.min(1)]],
      discount:    [0],
      amount:      [{ value: 0, disabled: true }],
      ActionType:  [''],
      createdDate: [''],
      isUpdated:   [''],
      isDeleted:   [false],
    });
    }

    calculateAmount() {
        const quantity = this.orderForm.get('quantity')?.value;
        let discount = this.orderForm.get('discount')?.value || 0;

        if (!quantity || quantity <= 0 || !this.selectedRate) {
            this.showAmountSection = false;
            this.orderForm.get('amount')?.setValue('');
            return;
        }

        // BASE calculation
        let baseAmount = quantity * this.selectedRate;

        // Discount on BASE ONLY
        let discountAmount = 0;
        if (discount > 0) {
            discountAmount = baseAmount * (discount / 100);
        }
        let discountedBase = baseAmount - discountAmount;

        // Tax on discounted base
        let taxAmount = discountedBase * (this.selectedTax / 100);

        // Final
        let finalAmount = discountedBase + taxAmount;

        this.orderForm.get('amount')?.setValue(finalAmount.toFixed(2));
        this.showAmountSection = true;
    }

    // onSubmit() {
    //     if (this.orderForm.valid) {
    //         const orderData = this.orderForm.getRawValue();

    //         orderData.ActionType = this.isEdit ? 'update' : 'create';
    //         orderData.createdDate = new Date().toISOString();
    //         orderData.isUpdated = new Date().toISOString();
    //         orderData.isDeleted = false;
    //         this.orderService.saveOrder(orderData).subscribe({
    //             next: (response) => {
    //                 this.showSuccess('Order saved successfully!');
    //                 console.log('API Response:', response);
    //                 this.clearForm();
    //                 this.goBack();
    //             },
    //             error: (error) => {
    //                 this.showError('Failed to save order.');
    //                 console.error('API Error:', error);
    //             }
    //         });
    //     } else {
    //         this.showError('Please fill all required fields correctly.');
    //     }
    // }

    loadProducts(): void {
        this.loading = true;
        this.productService.getAllProducts().subscribe({
            next: (data) => {
                this.Products = data;
                this.loading = false;
            },
            error: (err) => {
                this.showError("Error Loading Products");
                console.error(err);
                this.loading = false;
            }
        });
    }

    loadCustomers(): void {
        this.loading = true;
        this.leadservice.getClosureData().subscribe({
            next: (data) => {
                this.Customers = data;
                this.loading = false;
            },
            error: (err) => {
                this.showError("Error Loading Customers");
                console.error(err);
                this.loading = false;
            }
        });
    }

    clearForm() {
        this.orderForm.reset();
        this.showAmountSection = false;
    }

    closeForm() {
        this.orderForm.reset();
        this.showAmountSection = false;
    }

    goBack() {
        this.router.navigate(['/Mainlayout/order-list']);
    }

    private showSuccess(message: string): void {
        alert(message);
    }

    private showError(message: string): void {
        alert(message);
    }

    onOrderSubmit() {
    if (this.orderForm.invalid) {
      this.orderForm.markAllAsTouched();
      return;
    }

    const payload = this.orderForm.getRawValue();
    payload.ActionType  = this.isEdit ? 'update' : 'create';
    payload.createdDate = new Date().toISOString();
    payload.isUpdated   = new Date().toISOString();
    payload.isDeleted   = false;

    if (this.isEdit) {
      // use the same orderId you stored
      this.orderService.updateOrder(this.orderId, payload).subscribe({
        next: () => {
          this.showSuccess('Order updated successfully!');
          this.router.navigate(['/Mainlayout/order-list']);
        },
        error: err => this.showError(err.error?.message || 'Error updating order')
      });
    } else {
      this.orderService.saveOrder(payload).subscribe({
        next: () => {
          this.showSuccess('Order created successfully!');
          this.router.navigate(['/Mainlayout/order-list']);
        },
        error:    err => this.showError('Failed to save order.')
      });
    }
  }

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
}
