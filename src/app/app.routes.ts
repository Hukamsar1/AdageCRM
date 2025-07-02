import { Routes } from "@angular/router";
import { HomePageComponent } from "./features/Home/home-page.component/home-page.component";
import { OTPSentComponent } from "./features/auth/Otpsent.component";
import { LoginComponent } from "./features/auth/login.component";
import { SignupComponent } from "./features/auth/signup.component";
import { NotificationComponent } from "./shared/components/notification.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { DepartmentComponent } from "./Master/Department/department.component";
import { DepartmentListComponent } from "./Master/Department/department-list.component";
import { LeadComponent } from "./Master/lead.component";
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

export const appRoutes: Routes = [
  { path: '', component: HomePageComponent, pathMatch: 'full' },
  { path: 'Otpsent', component: OTPSentComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: '', component: NotificationComponent },
  { path: 'dashboard', component: DashboardComponent },
  {
    path: 'Mainlayout',
    component: MainLayoutComponent,
    children: [
      { path: 'lead', component: LeadComponent },

      // Department

      { path: 'department/create', component: DepartmentComponent },
      { path: 'department/create/:id', component: DepartmentComponent },
      { path: 'department/list', component: DepartmentListComponent },

      // Area

      { path: 'area/create', component: AreaComponent },

      // Updated designation routes:
      
      { path: 'designation/create', component: DesignationComponent },
      { path: 'designation/create/:id', component: DesignationComponent }, // This is the key fix
      { path: 'designation/list', component: DesignationListComponent },

      // Employee

      { path: 'employee/create', component: EmployeeComponent },
      { path: 'employee/edit/:id', component: EmployeeComponent },
      { path: 'employee/list', component: EmployeeListComponent },

      // Enquery

      { path: 'enquiry-list', component: EnqueryListComponent },
      { path: 'enquiry/create', component: EnquirySourceFormComponent },
      { path: 'enquirylist/edit/:id', component: EnquirySourceFormComponent },

      // Product

      { path: 'product-list', component: ProductListComponent },
      { path: 'product-create', component: ProductComponent },
      { path: 'product/edit/:id', component: ProductComponent }
    ]
  }
];