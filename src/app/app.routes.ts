import { Routes } from "@angular/router";
import { HomePageComponent } from "./features/Home/home-page.component/home-page.component";
import { OTPSentComponent } from "./features/auth/Otpsent.component";
import { LoginComponent } from "./features/auth/login.component";
import { SignupComponent } from "./features/auth/signup.component";
import { NotificationComponent } from "./shared/components/notification.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { DepartmentComponent } from "./Master/Department/department.component";
import { DepartmentListComponent } from "./Master/Department/department-list.component";
import { MainLayoutComponent } from "./layouts/mainlayout.component";
import { DesignationComponent } from "./Master/Designation/designation.component";
import { AreaComponent } from "./Master/Area/area.component";
import { DesignationListComponent } from "./Master/Designation/designation-list.component";
import { EmployeeComponent } from "./Master/Employee/employee.component";
import { EmployeeListComponent } from "./Master/Employee/employee-list.component";
import { EnquirySourceFormComponent } from "./Master/Enquery/enquery.component";
import { ProductComponent } from "./Master/Products/Product.component";
import { EnqueryListComponent } from "./Master/Enquery/enquery-list.component";
import { ProductListComponent } from "./Master/Products/product-list.component";
import { CompetitorFormComponent } from "./Master/ComptetorProduct/competitor.component";
import { CompetitorListComponent } from "./Master/ComptetorProduct/competitor-list.component";
import { LeadComponent } from "./Sale/Lead/lead.component";
import { LeadListComponent } from "./Sale/Lead/lead-list.component";
import { OrderComponent } from "./Sale/Orders/order.component";
import { OrderListComponent } from "./Sale/Orders/order-list.component";
import { PaymentComponent } from "./Sale/Payment/payment.component";
import { PaymentListComponent } from "./Sale/Payment/payment-list.component";
import { TargrtIncentiveComponent } from "./Sale/TargetIncentive/targetIncentive.component";
import { CustomerReportComponent } from "./Reports/customer/customerReport.component";
import { LeadReportComponent } from "./Reports/lead/lead.report.component";
import { OrderReportComponent } from "./Reports/order/order.report.component";
import { targetIncentiveListComponent } from "./Sale/TargetIncentive/targetIncentive-list.component";

export const appRoutes: Routes = [
  // Redirect root '' to /AdageCRM
  { path: '', redirectTo: '/AdageCRM', pathMatch: 'full' },

  // AdageCRM route
  { path: 'AdageCRM', component: HomePageComponent, pathMatch: 'full' },

  { path: 'Otpsent', component: OTPSentComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },

  {
    path: 'Mainlayout',
    component: MainLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },

      // Department
      { path: 'department/create', component: DepartmentComponent },
      { path: 'department/create/:id', component: DepartmentComponent },
      { path: 'department/list', component: DepartmentListComponent },

      // Area
      { path: 'area/create', component: AreaComponent },

      // Designation
      { path: 'designation/create', component: DesignationComponent },
      { path: 'designation/create/:id', component: DesignationComponent },
      { path: 'designation/list', component: DesignationListComponent },

      // Employee
      { path: 'employee/create', component: EmployeeComponent },
      { path: 'employee/edit/:id', component: EmployeeComponent },
      { path: 'employee/list', component: EmployeeListComponent },

      // Enquiry
      { path: 'enquiry-list', component: EnqueryListComponent },
      { path: 'enquiry/create', component: EnquirySourceFormComponent },
      { path: 'enquirylist/edit/:id', component: EnquirySourceFormComponent },

      // Product
      { path: 'product-list', component: ProductListComponent },
      { path: 'product-create', component: ProductComponent },
      { path: 'product/edit/:id', component: ProductComponent },

      // Lead
      { path: 'leadcreate', component: LeadComponent },
      { path: 'lead-list', component: LeadListComponent },
      { path: 'leadcreate/edit/:id', component: LeadComponent },

      // Competitor
      { path: 'competetor-list', component: CompetitorListComponent },
      { path: 'competetor-create', component: CompetitorFormComponent },
      { path: 'competetor/edit/:id', component: CompetitorFormComponent },

      // Order
      { path: 'order-list', component: OrderListComponent },
      { path: 'order-create', component: OrderComponent },
      { path: 'order/edit/:id', component: OrderComponent },

      // Payment
      { path: 'payment-list', component: PaymentListComponent },
      { path: 'payment-create', component: PaymentComponent },
      { path: 'payment/edit/:id', component: PaymentComponent },

      { path: 'targrtIncentive-list', component: targetIncentiveListComponent },
      { path: 'targrtIncentive-create', component: TargrtIncentiveComponent },
      { path: 'targrtIncentive/edit/:id', component: TargrtIncentiveComponent },

      // Customer Report
      { path: 'customer-report', component: CustomerReportComponent },
      { path: 'order-report', component: OrderReportComponent },
      { path: 'lead-report', component: LeadReportComponent },
    ]
  }
];
