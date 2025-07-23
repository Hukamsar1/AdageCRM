import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { EmployeeService } from 'src/app/core/Service/EmployeeService';
import { DesignationService } from 'src/app/core/Service/degnationService';
import { Designation } from 'src/app/core/interface/Ideignation';

@Component({
    selector: 'app-enquery-list',
    imports: [AgGridModule, CommonModule],
    templateUrl: './enquery-list.component.html',
    styleUrls: ['./enquery-list.component.scss']
})
export class EnqueryListComponent implements OnInit {
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
        private enqueryService: EmployeeService
    ) { }

    ngOnInit(): void {
        this.setupColumnDefs();
        this.loadEnquery();
    }

    setupColumnDefs(): void {
        this.columnDefs = [
            { headerName: 'EnqueryId', field: 'enquirySourceId', width: 80 },
            { headerName: 'Enquery Name', field: 'enquirySourceName' },
            {
                headerName: 'Actions',
                width: 120,
                cellRenderer: (params: any) => `
          <div class="text-center">
            <button class="btn btn-warning me-1 btn-sm" 
              style="font-size:12px; padding:2px; width:18px; height:25px; margin-bottom:8px; margin-left:50px;" 
              data-action="edit" data-id="${params.data.enquirySourceId}" title="Edit">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn btn-danger btn-sm" 
              style="font-size:12px; padding:2px; width:18px; height:25px; margin-bottom:8px;" 
              data-action="delete" data-id="${params.data.enquirySourceId}" title="Delete">
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
            this.router.navigate([`/Mainlayout/enquirylist/edit/${id}`]); // This matches the new route
        } else if (action === 'delete' && id) {
            this.confirmAndDelete(+id);
        }
    }

    confirmAndDelete(id: number): void {
        if (confirm('Are you sure you want to delete this Enquery?')) {
            this.loading = true;
            this.enqueryService.deleteEnquery(id, 'delete').subscribe({
                next: () => this.loadEnquery(),
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

    loadEnquery(): void {
        this.loading = true;
        this.enqueryService.getAllEnquery().subscribe({
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
        this.router.navigate(['/Mainlayout/enquiry/create']);
    }

}
