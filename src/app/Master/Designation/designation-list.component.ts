import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { DesignationService } from 'src/app/core/Service/degnationService';
import { Designation } from 'src/app/core/interface/Ideignation';

@Component({
    selector: 'app-designation-list',
    standalone: true,
    imports: [AgGridModule, CommonModule],
    templateUrl: './designation-list.component.html',
    styleUrls: ['./designation-list.component.scss'],
})
export class DesignationListComponent implements OnInit {
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
    departments = [
        { id: 1, name: 'Human Resources' },
        { id: 2, name: 'Information Technology' },
        { id: 3, name: 'Finance' },
        { id: 4, name: 'Marketing' },
        { id: 5, name: 'Operations Management' },
        { id: 6, name: 'Accounts' },
        { id: 7, name: 'Sales' },
        { id: 8, name: 'Research and Development' },
        { id: 9, name: 'Customer Service' },
        { id: 10, name: 'Legal' },
        { id: 11, name: 'Administration' },
        { id: 12, name: 'Public Relations' },
        { id: 13, name: 'Purchasing' },
        { id: 14, name: 'Logistics' },
        { id: 15, name: 'Facilities Management' },
        { id: 16, name: 'Procurement' },
        { id: 17, name: 'Project Management' },
        { id: 18, name: 'Risk Management' },
        { id: 19, name: 'Compliance' },
        { id: 20, name: 'Customer Relations' },
        { id: 21, name: 'Support' },
        { id: 22, name: 'Training' },
        { id: 23, name: 'Engineering' },
        { id: 24, name: 'Design' },
        { id: 25, name: 'Quality Assurance' },
        { id: 26, name: 'Supply Chain' },
        { id: 27, name: 'Product Management' },
        { id: 28, name: 'Business Development' },
    ];

    reportToList = [
        { id: 101, name: 'John Smith', designation: 'Director' },
        { id: 102, name: 'Sarah Johnson', designation: 'Senior Manager' },
        { id: 103, name: 'Michael Brown', designation: 'Department Head' },
        { id: 104, name: 'Emily Davis', designation: 'Team Lead' },
    ];

    constructor(
        private router: Router,
        private designationService: DesignationService
    ) { }

    ngOnInit(): void {
        this.setupColumnDefs();
        this.loadDesignations();
    }

    setupColumnDefs(): void {
        this.columnDefs = [
            { headerName: 'ID', field: 'designationId', width: 80 },
            { headerName: 'Designation Name', field: 'designationName' },
            { headerName: 'Department', field: 'departmentName' },
            { headerName: 'Reports To', field: 'reportTo' },
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
            this.router.navigate([`/Mainlayout/designation/create/${id}`]); // This matches the new route
        } else if (action === 'delete' && id) {
            this.confirmAndDelete(+id);
        }
    }

    confirmAndDelete(id: number): void {
        if (confirm('Are you sure you want to delete this designation?')) {
            this.loading = true;
            this.designationService.deleteDesignation(id, 'delete').subscribe({
                next: () => this.loadDesignations(),
                error: (err) => {
                    this.error = 'Error deleting designation';
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

    loadDesignations(): void {
        this.loading = true;
        this.designationService.getDesignations().subscribe({
            next: (data) => {
                this.rowData = data.map(item => ({
                    ...item,
                    departmentName: this.getDepartmentName(item.departmentId),
                    reportTo: this.getReportToName(item.reportToId)
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
        this.router.navigate(['/Mainlayout/designation/create']);
    }

    private getDepartmentName(departmentId?: number): string {
        if (departmentId == null) return 'Unknown';
        const dept = this.departments.find(d => d.id === departmentId);
        return dept ? dept.name : 'Unknown';
    }

    private getReportToName(reportToId?: number): string {
        if (reportToId == null) return 'N/A';
        const person = this.reportToList.find(p => p.id === reportToId);
        return person ? person.name : 'N/A';
    }
}
