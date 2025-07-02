import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/core/Service/productService';

@Component({
  selector: 'app-product-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './Product.component.html',
  styleUrls: ['./Product.component.scss']
})
export class ProductComponent implements OnInit {
  ProductForm!: FormGroup;
  isEdit = false;
  isLoading = false;
  isEditMode = false;
  productId!: number;
  id?: number;
  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.ProductForm = this.fb.group({
      productName: ['', Validators.required],
      rate: ['', [Validators.required, Validators.min(0)]],
      tax: ['', [Validators.required, Validators.min(0)]]
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
        this.productId = +id;
        this.loadProductData(this.productId);
      }
    });
  }

  private loadProductData(id: number): void {
    this.isLoading = true;
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.ProductForm.patchValue({
          productName: product.productName,
          rate: product.rate,
          tax: product.tax,
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading Product:', error);
        this.isLoading = false;
      }
    });
  }

  onSubmit() {
  if (this.ProductForm.invalid) {
    this.ProductForm.markAllAsTouched();
    return;
  }

  const productName = this.ProductForm.get('productName')?.value.trim();

  // Check for duplicate
  this.productService.checkDuplicateProductName(productName, this.id?.valueOf() || 0).subscribe({
    next: (isDuplicate) => {
      if (isDuplicate) {
        alert('This product name already exists. Please choose another.');
        return;
      }

      // If no duplicate (or edit mode), proceed
      this.saveProduct();
    },
    error: (err) => {
      console.error('Error checking duplicate', err);
      this.showError('Error checking product name. Please try again.');
    }
  });
}

private saveProduct() {
  const data = {
    ...this.ProductForm.value,
    actionType: this.isEdit ? 'update' : 'create',
    isDeleted: 0,
    createdDate: new Date().toISOString(),
    isUpdated: new Date().toISOString()
  };

  if (this.isEdit) {
    this.productService.updateProduct(this.id!, data).subscribe({
      next: () => {
        this.ProductForm.reset();
        this.showSuccess('Product updated successfully!');
        this.router.navigate(['/product-list']);
      },
      error: (error) => {
        console.error('Error details:', error);
        this.showError(error.error?.message || 'Error updating Product');
      }
    });
  } else {
    this.productService.createProduct(data).subscribe({
      next: () => {
        this.ProductForm.reset();
        this.router.navigate(['/product-list']);
        this.showSuccess('Product saved successfully!');
      },
      error: (err) => {
        console.error('Product Create failed', err);
        this.showError('Error saving Product. Please try again.');
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

  clearForm(): void {
    this.ProductForm.reset();
  }

  closeForm(): void {
    this.router.navigate(['/product-list']);
  }

  goBack(): void {
    this.router.navigate(['/Mainlayout/product-list']);

  }
}
