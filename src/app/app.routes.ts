// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomePageComponent } from './features/Home/home-page.component/home-page.component';
import { OTPSentComponent } from './features/auth/Otpsent.component';
import { LoginComponent } from './features/auth/login.component';
import { SignupComponent } from './features/auth/signup.component';
import { NotificationComponent } from './shared/components/notification.component';

export const appRoutes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'Otpsent', component: OTPSentComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: '', component: NotificationComponent },
 // { path: '', component: dash },
];
