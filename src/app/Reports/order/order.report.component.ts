import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { AreaService } from 'src/app/core/Service/areaService';
import { LeadService } from 'src/app/core/Service/LeadService';
import { OrderService } from 'src/app/core/Service/OrderService ';


@Component({
    selector: 'app-order-list',
    imports: [AgGridModule, CommonModule],
    templateUrl: './order.report.component.html',
    styleUrls: ['./order.report.component.scss']
})

export class OrderReportComponent implements OnInit {
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
    allCities: any[] = [];

    private gridApi!: GridApi;
    loading = true;
    error: string | null = null;

    constructor(
        private router: Router,
        private areaService: AreaService,
        private orderService: OrderService
    ) { }

    ngOnInit(): void {
        this.setupColumnDefs();
       // this.loadOrder();
        this.loadAllCitiesAndLeads();
    }

    setupColumnDefs(): void {
        this.columnDefs = [
            { headerName: 'Order ID', field: 'orderId', width: 100 },
            { headerName: 'Date', field: 'createdDate', width: 80 },
            { headerName: 'Name', field: 'customer', width: 80 },
            { headerName: 'City', field: 'cityName', width: 80 },
            { headerName: 'Product', field: 'product', width: 80 },
            { headerName: 'Amount', field: 'amount', width: 80 }
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
                this.loadOrder();  // now call loadLead only after cities are loaded
            },
            error: (err) => {
                console.error('Error loading all cities:', err);
                this.loading = false;
            }
        });
    }

loadOrder(): void {
        this.loading = true;
        this.orderService.getAllOrder().subscribe({
            next: (data) => {
                this.rowData = data.map(item => {
                    const city = this.allCities.find(c => c.cityId === item.cityId);
                    return {
                        ...item,
                        cityName: city ? city.cityName : ''
                    };
                });
                this.loading = false;
            },
            error: (err) => {
                this.error = 'Error loading leads';
                console.error(err);
                this.loading = false;
            }
        });
    }

}
