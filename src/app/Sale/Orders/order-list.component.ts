import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { OrderService } from 'src/app/core/Service/OrderService ';


@Component({
    selector: 'app-order-list',
    imports: [AgGridModule, CommonModule],
    templateUrl: './order-list.component.html',
    styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {
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
        private orderService: OrderService
    ) { }

    ngOnInit(): void {
        this.setupColumnDefs();
        this.loadOrder();
    }

    setupColumnDefs(): void {
        this.columnDefs = [
            { headerName: 'Customer', field: 'customer', width: 100 },
            { headerName: 'Product', field: 'product', width: 80 },
            { headerName: 'Quantity', field: 'quantity', width: 80 },
            { headerName: 'Discount', field: 'discount', width: 80 },
            { headerName: 'Amount', field: 'amount', width: 80 },
            {
                headerName: 'Actions',
                width: 120,
                cellRenderer: (params: any) => `
          <div class="text-center">
            <button class="btn btn-warning me-1 btn-sm" 
              style="font-size:12px; padding:2px; width:18px; height:25px; margin-bottom:8px; margin-left:50px;" 
              data-action="edit" data-id="${params.data.orderId}" title="Edit">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn btn-danger btn-sm" 
              style="font-size:12px; padding:2px; width:18px; height:25px; margin-bottom:8px;" 
              data-action="delete" data-id="${params.data.orderId}" title="Delete">
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
            this.router.navigate([`/Mainlayout/order/edit/${id}`]); // This matches the new route
        } else if (action === 'delete' && id) {
            this.confirmAndDelete(+id);
        }
    }

    confirmAndDelete(id: number): void {
        if (confirm('Are you sure you want to delete this Order?')) {
            this.loading = true;
            this.orderService.deleteOrder(id, 'delete').subscribe({
                next: () => this.loadOrder(),
                error: (err) => {
                    this.error = 'Error deleting Order';
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

    loadOrder(): void {
        this.loading = true;
        this.orderService.getAllOrder().subscribe({
            next: (data) => {
                this.rowData = data.map(item => ({
                    ...item,

                }));
                this.loading = false;
            },
            error: (err) => {
                this.error = 'Error loading Order';
                console.error(err);
                this.loading = false;
            }
        });
    }

    createNewEnqury(): void {
        this.router.navigate(['/Mainlayout/order-create']);
    }

}
