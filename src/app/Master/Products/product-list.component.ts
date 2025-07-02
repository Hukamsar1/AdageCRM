import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { EmployeeService } from 'src/app/core/Service/EmployeeService';
import { ProductService } from 'src/app/core/Service/productService';

@Component({
    selector: 'app-product-list',
    imports: [AgGridModule, CommonModule],
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
    @ViewChild('agGrid') agGrid!: AgGridAngular;

    columnDefs: ColDef[] = [];
    rowData: any[] = [];
    departments : any[] = [];
    reportToList : any[] = [];
    defaultColDef: ColDef = {
        flex: 1,
        minWidth: 100,
        resizable: true,
        sortable: true,
        filter: true,
    };

    private gridApi!: GridApi;
    loading = true;
    error: string | null = null;

    constructor(
        private router: Router,
        private productService: ProductService
    ) { }

    ngOnInit(): void {
        this.setupColumnDefs();
        this.loadProduct();
    }

    setupColumnDefs(): void {
        this.columnDefs = [
            { headerName: 'ProductId', field: 'productId', width: 80 },
            { headerName: 'Product Name', field: 'productName' },
            { headerName: 'Rate', field: 'tax', width: 80 },
            { headerName: 'Tax', field: 'rate', width: 80 },
            {
                headerName: 'Actions',
                width: 120,
                cellRenderer: (params: any) => `
          <div class="text-center">
            <button class="btn btn-warning me-1 btn-sm" 
              style="font-size:12px; padding:2px; width:18px; height:25px; margin-bottom:8px; margin-left:50px;" 
              data-action="edit" data-id="${params.data.productId}" title="Edit">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn btn-danger btn-sm" 
              style="font-size:12px; padding:2px; width:18px; height:25px; margin-bottom:8px;" 
              data-action="delete" data-id="${params.data.productId}" title="Delete">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        `
            }
        ];
    }

    onCellClicked(event: any): void {
        const target = event.event.target;
        const action = target.closest('button')?.getAttribute('data-action');
        const id = target.closest('button')?.getAttribute('data-id');

        if (action === 'edit' && id) {
            this.router.navigate([`/Mainlayout/product/edit/${id}`]); // This matches the new route
        } else if (action === 'delete' && id) {
            this.confirmAndDelete(+id);
        }
    }

    confirmAndDelete(id: number): void {
        if (confirm('Are you sure you want to delete this Enquery?')) {
            this.loading = true;
            this.productService.deleteProduct(id, 'delete').subscribe({
                next: () => this.loadProduct(),
                error: (err) => {
                    this.error = 'Error deleting Enquery';
                    console.error(err);
                    this.loading = false;
                }
            });
        }
    }


    onGridReady(params: GridReadyEvent): void {
        this.gridApi = params.api;
        setTimeout(() => this.gridApi.sizeColumnsToFit(), 0);
    }

    loadProduct(): void {
        this.loading = true;
        this.productService.getAllProducts().subscribe({
            next: (data) => {
                this.rowData = data.map(item => ({
                    ...item,

                }));
                this.loading = false;
            },
            error: (err) => {
                this.error = 'Error loading Enquery';
                console.error(err);
                this.loading = false;
            }
        });
    }

    createNewEnqury(): void {
        this.router.navigate(['/Mainlayout/product-create']);
    }

}
