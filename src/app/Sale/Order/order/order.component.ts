import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LeadService } from 'src/app/core/Service/LeadService';
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

  Customers: any[] = [];
  Products: any[] = [];

  selectedRate: number = 0;
  selectedTax: number = 0;
  showAmountField = false;

  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private productService: ProductService,
    private leadservice: LeadService
  ) {}

  ngOnInit(): void {
    this.FormCreate();
    this.loadProducts();
    this.loadCustomers();

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
      this.showAmountField = false;
      this.orderForm.get('amount')?.setValue('');
    });

    // React to Quantity input
    this.orderForm.get('quantity')?.valueChanges.subscribe(() => {
      this.calculateAmount();
    });
  }

  FormCreate() {
    this.orderForm = this.fb.group({
      customer: ['', Validators.required],
      product: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      amount: [{ value: '', disabled: true }]
    });
  }

  calculateAmount() {
    const quantity = this.orderForm.get('quantity')?.value;

    if (!quantity || quantity <= 0 || !this.selectedRate) {
      this.showAmountField = false;
      this.orderForm.get('amount')?.setValue('');
      return;
    }

    const baseAmount = quantity * this.selectedRate;
    const taxAmount = baseAmount * (this.selectedTax / 100);
    const totalAmount = baseAmount + taxAmount;

    this.orderForm.get('amount')?.setValue(totalAmount.toFixed(2));
    this.showAmountField = true;
  }

  onSubmit() {
    if (this.orderForm.valid) {
      console.log('Form Submitted:', this.orderForm.getRawValue());
    }
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.Products = data;
        this.showSuccess("Products Loaded Successfully");
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
        this.showSuccess("Customers Loaded Successfully");
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
    this.showAmountField = false;
  }

  closeForm() {
    this.orderForm.reset();
    this.showAmountField = false;
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
}
