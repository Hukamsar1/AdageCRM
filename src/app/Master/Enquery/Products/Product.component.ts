import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { ProductService } from 'src/app/core/Service/productService';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './Product.component.html',
  styleUrls: ['./Product.component.scss']
})
export class ProductComponent implements OnInit {
  ProductForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.ProductForm = this.fb.group({
      productName: ['', Validators.required],
      rate: ['', [Validators.required, Validators.min(0)]],
      tax: ['', [Validators.required, Validators.min(0)]]
    });

  }

  onSubmit() {
    if (this.ProductForm.invalid) {
      this.ProductForm.markAllAsTouched();
      return;
    }

    const data = {
      ...this.ProductForm.value,
      actionType: 'create',
      isDeleted: 0,
      createdDate: new Date().toISOString(),
      isUpdated: new Date().toISOString()
    };

    this.productService.createProduct(data).subscribe({
      next: () => {
        this.ProductForm.reset();
        this.router.navigate(['/product-list']),
          alert('Product saved successfully!');
      },
      error: (err) => {
        console.error('Create failed', err);
        alert('Error saving product. Please try again.');
      }
    });
  }

  clearForm(): void {
    this.ProductForm.reset();
  }

  closeForm(): void {
    this.router.navigate(['/Product-list']);
  }

  goBack(): void {
    this.router.navigate(['/Mainlayout/Product-list']);

  }
}
