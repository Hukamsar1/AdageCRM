import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { LeadService } from 'src/app/core/Service/LeadService';


@Component({
    selector: 'lead-list',
    imports: [AgGridModule, CommonModule],
    templateUrl: './lead-list.component.html',
    styleUrls: ['./lead-list.component.scss']
})
export class LeadListComponent implements OnInit {
    @ViewChild('agGrid') agGrid!: AgGridAngular;

    columnDefs: ColDef[] = [];
    rowData: any[] = [];
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

    // ✅ Master lists


    constructor(
        private router: Router,
        private leadservice: LeadService
    ) { }

    ngOnInit(): void {
        this.setupColumnDefs();
        this.loadLead();
    }

    setupColumnDefs(): void {
        this.columnDefs = [
            { headerName: 'Business Name', field: 'businessName', width: 80 },
            { headerName: 'City', field: 'cityId' },
            { headerName: 'Contact Person', field: 'firstName' },
            { headerName: 'Phone No.', field: 'phone' },
            { headerName: 'Business Name', field: 'business' },
            { headerName: 'Suggested Product', field: 'suggestedProduct' },
            { headerName: 'Estimated Closure Date', field: 'estimatedClosureDate' },
            { headerName: 'Next Visit', field: 'nextVisitAction' },
            {
                headerName: 'Actions',
                width: 120,
                cellRenderer: (params: any) => `
          <div class="text-center">
            <button class="btn btn-warning me-1 btn-sm" 
              style="font-size:12px; padding:2px; width:18px; height:25px; margin-bottom:8px;" 
              data-action="edit" data-id="${params.data.designationId}" title="Edit">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn btn-danger btn-sm" 
              style="font-size:12px; padding:2px; width:18px; height:25px; margin-bottom:8px;" 
              data-action="delete" data-id="${params.data.designationId}" title="Delete">
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
            this.router.navigate([`/Mainlayout/create-list/${id}`]); // This matches the new route
        } else if (action === 'delete' && id) {
           // this.confirmAndDelete(+id);
        }
    }

    // confirmAndDelete(id: number): void {
    //     if (confirm('Are you sure you want to delete this designation?')) {
    //         this.loading = true;
    //         this.leadservice.getAllBussiness(id, 'delete').subscribe({
    //             next: () => this.loadDesignations(),
    //             error: (err) => {
    //                 this.error = 'Error deleting designation';
    //                 console.error(err);
    //                 this.loading = false;
    //             }
    //         });
    //     }
    // }


    onGridReady(params: GridReadyEvent): void {
        this.gridApi = params.api;
        setTimeout(() => this.gridApi.sizeColumnsToFit(), 0);
    }

    loadLead(): void {
        this.loading = true;
        this.leadservice.getAllBussinessDAta().subscribe({
            next: (data) => {
                this.rowData = data.map(item => ({
                    ...item,
                }));
                this.loading = false;
            },
            error: (err) => {
                this.error = 'Error loading designations';
                console.error(err);
                this.loading = false;
            }
        });
    }

    createNewDepartment(): void {
        this.router.navigate(['/Mainlayout/leadcreate']);
    }

}
