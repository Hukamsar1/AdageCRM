// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomePageComponent } from './features/Home/home-page.component/home-page.component';
import { RegisterComponent } from './features/auth/register.component';
import { LoginComponent } from './features/auth/login.component';

export const appRoutes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'signup', component: RegisterComponent },
  { path: 'login', component: LoginComponent },

];
