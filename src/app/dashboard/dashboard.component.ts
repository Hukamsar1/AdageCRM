import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartOptions, ChartData } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';


@Component({
    selector: 'app-dashboard',
    imports: [CommonModule, NgChartsModule],
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent {

  summaryCards = [
    { title: 'Total Sale', value: 0, color: 'bg-blue-500', icon: '💰' },
    { title: 'Total Purchase', value: 0, color: 'bg-teal-500', icon: '🧾' },
    { title: 'Total Income', value: 0, color: 'bg-orange-500', icon: '💵' },
    { title: 'Total Expenses', value: 0, color: 'bg-red-500', icon: '💸' }
  ];

  chartOptions: ChartOptions<'line'> = {
    responsive: true,
    elements: { line: { tension: 0.4 } },
    scales: { y: { beginAtZero: true } }
  };
  
  chartData: ChartData<'line'> = {
    labels: ['May 25', 'May 28', 'June 1', 'June 7', 'June 15'],
    datasets: [{ label: '', data: [0, 0, 0, 0, 0], borderColor: 'teal', backgroundColor: 'rgba(0,0,0,0)' }]
  };
}
