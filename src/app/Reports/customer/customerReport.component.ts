import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { AreaService } from 'src/app/core/Service/areaService';
import { LeadService } from 'src/app/core/Service/LeadService';
import { OrderService } from 'src/app/core/Service/OrderService ';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [AgGridModule, CommonModule],
  templateUrl: './customerReport.component.html',
  styleUrls: ['./customerReport.component.scss']
})
export class CustomerReportComponent implements OnInit {
  @ViewChild('agGrid') agGrid!: AgGridAngular;

  columnDefs: ColDef[] = [];
  rowData: any[] = [];
  allCities: any[] = [];
  allLeads: any[] = [];

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
    private areaService: AreaService,
    private orderService: OrderService,
    private leadService: LeadService
  ) { }

  ngOnInit(): void {
    this.setupColumnDefs();
    this.loadAllCitiesAndLeads();
  }

  setupColumnDefs(): void {
    this.columnDefs = [
      { headerName: 'Name', field: 'customer', width: 120 },
      { headerName: 'City', field: 'cityName', width: 100 },
      { headerName: 'Phone No', field: 'mobile', width: 120 },
      { headerName: 'Email', field: 'email', width: 160 },
      { headerName: 'Date', field: 'createdDate', width: 120 },
      { headerName: 'Users', field: 'quantity', width: 100 },
      { headerName: 'Product', field: 'product', width: 120 }
    ];
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
    setTimeout(() => this.gridApi.sizeColumnsToFit(), 0);
  }

  loadAllCitiesAndLeads(): void {
    this.loading = true;
    this.areaService.getAllCities().subscribe({
      next: (cities) => {
        this.allCities = cities;
        this.loadClosureData();
      },
      error: (err) => {
        console.error('Error loading cities:', err);
        this.loading = false;
      }
    });
  }

  loadClosureData(): void {
    this.leadService.getClosureData().subscribe({
      next: (leadData) => {
        this.allLeads = leadData;
        this.loadOrder();
      },
      error: (err) => {
        console.error('Error loading leads:', err);
        this.loading = false;
      }
    });
  }

  loadOrder(): void {
    this.orderService.getAllOrder().subscribe({
      next: (orderData:any[]) => {
        this.rowData = orderData.map((order : any) => {
          const city = this.allCities.find(c => c.cityId === order.cityId);
          const lead = this.allLeads.find(l => l.businessName === order.customer);

          return {
            ...order,
            cityName: city ? city.cityName : '',
            email: lead ? lead.email : '',
            mobile: lead ? lead.phone : ''
          };
        });

        this.loading = false;
      },
      error: (err :any) => {
        console.error('Error loading orders:', err);
        this.loading = false;
      }
    });
  }
}
