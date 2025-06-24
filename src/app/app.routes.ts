import { Routes } from '@angular/router';

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
  {
    path: 'orders',
    children: [
      { path: 'completed', loadComponent: () => import('./orders/completed-orders/completed-orders.component').then(m => m.CompletedOrdersComponent) },
      { path: 'post', loadComponent: () => import('./orders/post-orders/post-orders.component').then(m => m.PostOrdersComponent) },
      { path: 'in-progress', loadComponent: () => import('./orders/in-progress-orders/in-progress-orders.component').then(m => m.InProgressOrdersComponent) },
      { path: 'unconfirmed', loadComponent: () => import('./orders/unconfirmed-orders/unconfirmed-orders.component').then(m => m.UnconfirmedOrdersComponent) },
      { path: 'submitted', loadComponent: () => import('./orders/submitted-orders/submitted-orders.component').then(m => m.SubmittedOrdersComponent) },
      { path: 'revision', loadComponent: () => import('./orders/orders-in-revision/orders-in-revision.component').then(m => m.OrdersInRevisionComponent) },
      { path: 'paid', loadComponent: () => import('./orders/paid-orders/paid-orders.component').then(m => m.PaidOrdersComponent) },
      { path: 'unpaid', loadComponent: () => import('./orders/unpaid-orders/unpaid-orders.component').then(m => m.UnpaidOrdersComponent) },
      { path: 'disputed', loadComponent: () => import('./orders/disputed-orders/disputed-orders.component').then(m => m.DisputedOrdersComponent) },
      { path: 'requests', loadComponent: () => import('./orders/request-bid/request-bid.component').then(m => m.RequestBidComponent) }
    ]
  }
];
