import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent, ICellRendererParams } from 'ag-grid-community';
import { DepartmentService } from 'src/app/core/Service/DepartmentService ';

@Component({
  selector: 'app-department-list',
  standalone: true,
  imports: [AgGridModule, CommonModule],
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.scss'],
})
export class DepartmentListComponent implements OnInit {
  @ViewChild('agGrid') agGrid!: AgGridAngular;

  columnDefs: ColDef[] = [];
  rowData: any[] = []; // we'll bind transformed data
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
    private departmentService: DepartmentService
  ) { }

  ngOnInit(): void {
    this.setupColumnDefs();
    this.loadDepartments();
  }

  setupColumnDefs(): void {
    this.columnDefs = [
      {
        headerName: 'DepartmentId',
        field: 'departmentId',
        width: 80,
        headerClass: 'custom-header',
        resizable: true,
        sortable: true,
        filter: true,
        cellRenderer: (p: ICellRendererParams) => p.value || '-',
      },
      {
        headerName: 'Department Name',
        field: 'name',
        headerClass: 'custom-header',
        resizable: true,
        sortable: true,
        filter: true,
        cellRenderer: (p: ICellRendererParams) => p.value || 'No data',
      },
      {
        headerName: 'Reports To',
        field: 'parentDepartmentName',
        headerClass: 'custom-header',
        resizable: true,
        sortable: true,
        filter: true,
        cellRenderer: (p: ICellRendererParams) => p.value || 'N/A',
      },
      {
        headerName: 'Actions',
        width: 100,
        flex: 0,
        resizable: true,
        sortable: true,
        filter: true,
        cellRenderer: (params: any) => `
  <div class="text-center">
    <button class="btn btn-warning me-1" 
      style="font-size:12px; padding:2px; width:18px; height:25px; margin-bottom:8px;" 
      data-action="edit" data-id="${params.data.departmentId}" title="Edit">
      <i class="bi bi-pencil"></i>
    </button>
    <button class="btn btn-danger" 
      style="font-size:12px; padding:2px; width:18px; height:25px; margin-bottom:8px;" 
      data-action="delete" data-id="${params.data.departmentId}" title="Delete">
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
      this.router.navigate([`/Mainlayout/department/create/${id}`]);
    } else if (action === 'delete' && id) {
      this.deleteDepartment(+id); // implement this
    }
  }

  private deleteDepartment(id: number): void {
    if (confirm('Are you sure you want to delete this department?')) {
      this.departmentService.deleteDepartment(id).subscribe(
        () => this.loadDepartments(),
        (error) => {
          this.error = 'Error deleting department';
          console.error(error);
        }
      );
    }
  }


  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
    setTimeout(() => this.gridApi.sizeColumnsToFit(), 0);
  }

  loadDepartments(): void {
    this.loading = true;
    this.departmentService.getDepartments().subscribe(
      (data) => {
        // Map API response to UI model
        this.rowData = data.map((item) => ({
          departmentId: item.departmentId,
          name: item.departmentName,
          parentDepartmentName: item.underDepartment,
        }));
        this.loading = false;
      },
      (err) => {
        this.error = 'Error loading departments';
        console.error(err);
        this.loading = false;
      }
    );
  }

  createNewDepartment(): void {
    this.router.navigate(['/Mainlayout/department/create']);
  }
}
