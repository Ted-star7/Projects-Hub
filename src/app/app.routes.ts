import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegistrationComponent } from './registration/registration.component';
import { ContactComponent } from './contact/contact.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

// export const routes: Routes = [
// {path: 'login', component: LoginComponent},
// {path: '', component: DashboardComponent},
// {path: 'registration', component: RegistrationComponent},
// {path: 'contact', component: ContactComponent},
// {path: 'reset-password', component: ResetPasswordComponent}
// ];


export const routes: Routes = [
  { path: '', loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent) },
  { path: 'contact-us', loadComponent: () => import('./contact/contact.component').then(m => m.ContactComponent) },
  { path: 'login', loadComponent: () => import('./login/login.component').then(m => m.LoginComponent) },
  { path: 'registration', loadComponent: () => import('./registration/registration.component').then(m => m.RegistrationComponent) },
//   { path: 'blog', loadComponent: () => import('./blog/blog.component').then(m => m.BlogComponent) },

];