import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { CompetitorService } from 'src/app/core/Service/CompetitorService';

@Component({
  selector: 'app-competitor-list',
  standalone: true,
  imports: [AgGridModule, CommonModule],
  templateUrl: './competitor-list.component.html',
  styleUrls: ['./competitor-list.component.scss']
})
export class CompetitorListComponent implements OnInit {
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

  constructor(
    private router: Router,
    private competitorService: CompetitorService
  ) { }

  ngOnInit(): void {
    this.setupColumnDefs();
    this.loadCompetitors();
  }

  setupColumnDefs(): void {
    this.columnDefs = [
      { headerName: 'ID', field: 'competitorId', width: 80 },
      { headerName: 'Competitor Name', field: 'competitorName' },
      {
        headerName: 'Actions',
        width: 120,
        cellRenderer: (params: any) => `
          <div class="text-center">
            <button class="btn btn-warning me-1 btn-sm" 
              style="font-size:12px; padding:2px; width:18px; height:25px; margin-bottom:8px; margin-left:50px;" 
              data-action="edit" data-id="${params.data.competitorId}" title="Edit">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn btn-danger btn-sm" 
              style="font-size:12px; padding:2px; width:18px; height:25px; margin-bottom:8px;" 
              data-action="delete" data-id="${params.data.competitorId}" title="Delete">
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
      this.router.navigate([`/Mainlayout/competetor/edit/${id}`]);
    } else if (action === 'delete' && id) {
      this.confirmAndDelete(+id);
    }
  }

  confirmAndDelete(id: number): void {
  if (confirm('Are you sure you want to delete this competitor?')) {
    this.loading = true;
    this.competitorService.deleteCompetitor(id, 'delete').subscribe({
      next: () =>
        {
        this.loadCompetitors(),
        alert('Competitor deleted successfully');
        this.router.navigate(['/Mainlayout/competetor-list']);
        this.loading = false;
        }, 
      error: (err) => {
        this.error = 'Error deleting competitor';
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

  loadCompetitors(): void {
    this.loading = true;
    this.competitorService.getAllCompetitors().subscribe({
      next: (data) => {
        this.rowData = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error loading competitors';
        console.error(err);
        this.loading = false;
      }
    });
  }

  createNewCompetitor(): void {
    this.router.navigate(['/Mainlayout/competetor-create']);
  }
}
