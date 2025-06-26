  // src/app/app.routes.ts
  import { Routes } from '@angular/router';
  import { HomePageComponent } from './features/Home/home-page.component/home-page.component';
  import { OTPSentComponent } from './features/auth/Otpsent.component';
  import { LoginComponent } from './features/auth/login.component';
  import { SignupComponent } from './features/auth/signup.component';
  import { NotificationComponent } from './shared/components/notification.component';
  import { DashboardComponent } from './dashboard/dashboard.component';
  import { MainLayoutComponent } from './layouts/mainlayout.component';
  import { LeadComponent } from './Master/lead.component';
import { DepartmentComponent } from './Master/Department/department.component';
import { DepartmentListComponent } from './Master/Department/department-list.component';
import { AreaComponent   } from './Master/Area/area.component';
import { DesignationComponent } from './Master/Designation/designation.component';

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
       { path: 'department/create', component: DepartmentComponent },
       { path: 'department/create/:id', component: DepartmentComponent },
       { path: 'department/list', component: DepartmentListComponent },
       { path: 'area/create', component: AreaComponent },
       { path: 'designation/create', component: DesignationComponent },
       { path: 'designation/list', component: AreaComponent },
      ]
    }
  ];
