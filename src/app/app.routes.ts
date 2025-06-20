// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomePageComponent } from './features/Home/home-page.component/home-page.component';
import { RegisterComponent } from './features/auth/register.component';

export const appRoutes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'signup', component: RegisterComponent },
];
