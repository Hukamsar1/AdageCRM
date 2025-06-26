import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';

interface Department {
  id: number;
  name: string;
  parentDepartmentName?: string;
}

@Component({
  selector: 'app-department-list',
  standalone: true,
  imports: [AgGridModule, CommonModule],
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.scss']
})
export class DepartmentListComponent implements OnInit {
  @ViewChild('agGrid') agGrid!: AgGridAngular;

  public columnDefs: ColDef[] = [];
  public rowData: Department[] = [];
  public blankRowData: Department[] = [];
  public defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
    resizable: true,
    sortable: true,
    filter: true,
  };

  private gridApi!: GridApi;
  loading: boolean = true; // Start with loading true
  error: string | null = null;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.setupColumnDefs();
    this.createBlankRows(5); // Create 5 blank rows initially
    this.loadDepartments(); // Then load real data
  }

  createBlankRows(count: number): void {
    this.blankRowData = Array(count).fill({}).map((_, index) => ({
      id: index + 1,
      name: '',
      parentDepartmentName: ''
    }));
  }

  setupColumnDefs(): void {
    this.columnDefs = [
      { 
        headerName: 'ID', 
        field: 'id', 
        width: 80,
        cellRenderer: (params: any) => params.value || '-'
      },
      { 
        headerName: 'Department Name', 
        field: 'name',
        cellRenderer: (params: any) => params.value || 'No data'
      },
      {
        headerName: 'Reports To',
        field: 'parentDepartmentName',
        cellRenderer: (params: any) => params.value || 'N/A'
      },
      {
        headerName: 'Actions',
        width: 150,
        cellRenderer: () => `
          <button class="btn btn-sm btn-warning me-1" disabled>
            <i class="bi bi-pencil"></i>
          </button>
          
          <button class="btn btn-sm btn-danger" disabled>
            <i class="bi bi-trash"></i>
          </button>
        `,
        sortable: false,
        filter: false
      }
    ];
  }

   onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
    // Adjust columns to fit
    setTimeout(() => {
      this.gridApi.sizeColumnsToFit();
    }, 0);
  }


  loadDepartments(): void {
    // Simulate API call delay
    setTimeout(() => {
      this.rowData = [
        { id: 1, name: 'Management', parentDepartmentName: '' },
        { id: 2, name: 'Sales', parentDepartmentName: 'Management' },
        { id: 3, name: 'Marketing', parentDepartmentName: 'Sales' },
        { id: 4, name: 'Human Resources', parentDepartmentName: 'Management' },
        { id: 5, name: 'Customer Support', parentDepartmentName: 'Marketing' },
        { id: 6, name: 'Finance', parentDepartmentName: 'Management' }
      ];
      this.loading = false;
    }, 2000);
  }

  createNewDepartment(): void {
    this.router.navigate(['/Mainlayout/department/create']);
  }
}