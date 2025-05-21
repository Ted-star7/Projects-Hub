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
  { path: '', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent) },
   { path: 'activate-account', loadComponent: () => import('./activate-account/activate-account.component').then(m => m.ActivateAccountComponent) },
  { path: 'navbar', loadComponent: () => import('./navbar/navbar.component').then(m => m.NavbarComponent) },
  { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent) },
  { path: 'contact-us', loadComponent: () => import('./contact/contact.component').then(m => m.ContactComponent) },
  { path: 'login', loadComponent: () => import('./login/login.component').then(m => m.LoginComponent) },
  { path: 'registration', loadComponent: () => import('./registration/registration.component').then(m => m.RegistrationComponent) },
  { path: 'profile', loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent) },
  { path: 'resetpassword', loadComponent: () => import('./reset-password/reset-password.component').then(m => m.ResetPasswordComponent) },
  { path: 'sidebar', loadComponent: () => import('./sidebar/sidebar.component').then(m => m.SidebarComponent) },
//   { path: 'blog', loadComponent: () => import('./blog/blog.component').then(m => m.BlogComponent) },

];