import { Component, OnInit } from '@angular/core';
import { ColDef, GridReadyEvent } from 'ag-grid-community';
import { AgGridModule } from 'ag-grid-angular';
import { EmployeeService } from 'src/app/core/Service/EmployeeService';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DepartmentService } from 'src/app/core/Service/DepartmentService ';

@Component({
    selector: 'app-employee-list',
    standalone: true,
    imports: [AgGridModule, CommonModule, ReactiveFormsModule],
    templateUrl: './employee-list.component.html',
    styleUrls: ['./employee-list.component.scss'],

})
export class EmployeeListComponent implements OnInit {
    rowData: any[] = [];
    loading = true;
    errorMessage = '';
    error: string | null = null;
    columnDefs: ColDef[] = [];
    departmentMap: { [key: number]: string } = {};


    constructor(private employeeService: EmployeeService,
        private router: Router,
        private departmentService: DepartmentService,) { }


    setupColumnDefs = (): void => {
        this.columnDefs = [
            { headerName: 'ID', field: 'employeeId', width: 90 },
            { headerName: 'First Name', field: 'firstName', width: 150 },
            { headerName: 'Last Name', field: 'lastName', width: 150 },
            { headerName: 'Phone', field: 'phone', width: 130 },
            { headerName: 'Email', field: 'email', width: 150 },
            {
                headerName: 'Department',
                field: 'departmentId',
                width: 150,
                cellRenderer: (params: any) => this.departmentMap[params.value] || 'Unknown'
            },
            { headerName: 'Area', field: 'areaId', width: 110 },
            {
                headerName: 'Actions',
                width: 100,
                cellRenderer: (params: any) => `
        <div class="text-center">
          <button class="btn btn-warning me-1 btn-sm" 
            style="font-size:12px; padding:2px; width:18px; height:25px; margin-bottom:8px;" 
            data-action="edit" data-id="${params.data.employeeId}" title="Edit">
            <i class="bi bi-pencil"></i>
          </button>
          <button class="btn btn-danger btn-sm" 
            style="font-size:12px; padding:2px; width:18px; height:25px; margin-bottom:8px;" 
            data-action="delete" data-id="${params.data.employeeId}" title="Delete">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      `
            }
        ];
    };


    // Default Column Definitions: Apply to all columns
    defaultColDef: ColDef = {
        filter: true,
        sortable: true,
        resizable: true
    };


    ngOnInit(): void {
        this.loadEmployees();
        this.setupColumnDefs();
        this.loadDepartments();
    }

    loadDepartments(): void {
        this.departmentService.getDepartments().subscribe({
            next: (departments) => {
                this.departmentMap = departments.reduce((acc, dept) => {
                    if (dept.departmentId !== undefined) {
                        acc[dept.departmentId] = dept.departmentName;
                    }
                    return acc;
                }, {} as { [key: number]: string });


                this.loadEmployees();         // load employees *after* we have departments
                this.setupColumnDefs();
            },
            error: (err) => {
                console.error('Error loading departments', err);
            }
        });
    }


    loadEmployees(): void {
        this.loading = true;
        this.employeeService.getAllEmployees().subscribe({
            next: (data) => {
                this.rowData = data;
                this.loading = false;
            },
            error: (err) => {
                console.error('Error fetching employee list', err);
            }
        });
    }


    onGridReady(params: GridReadyEvent) {
        params.api.sizeColumnsToFit();
    }

    viewEmployee(id: number) {
        // Implement view functionality
        console.log('View employee:', id);
    }

    confirmAndDelete(id: number): void {
        if (confirm('Are you sure you want to delete this Employee?')) {
            this.loading = true;
            this.employeeService.deleteEmployee(id, 'delete').subscribe({
                next: () => {
                    this.showSuccess('Employee deleted successfully!');
                    this.loadEmployees();  // Refresh the table
                },
                error: (err) => {
                    this.error = 'Error deleting designation';
                    console.error(err);
                    this.loading = false;
                }
            });
        }
    }

    showSuccess(message: string): void {
        alert(message);
    }

    onCellClicked(event: any): void {
        const target = event.event.target;
        const action = target.closest('button')?.getAttribute('data-action');
        const id = target.closest('button')?.getAttribute('data-id');

        if (action === 'edit' && id) {
            this.router.navigate([`/Mainlayout/employee/edit/${id}`]); // This matches the new route
        } else if (action === 'delete' && id) {
            this.confirmAndDelete(+id);
        }
    }

    createNewEmployee(): void {
        this.router.navigate(['/Mainlayout/employee/create']);
    }
}