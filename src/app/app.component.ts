import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, SidebarComponent, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Projects-hub';
  hideSidebar = false;
  isSidebarOpen = false;
  isMobileView = false;

  // Routes where sidebar/navbar are hidden
  protectedRoutes: string[] = [
    '/', '/login', '/resetpassword', '/registration', '/activate-account'
  ];

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.checkViewport();
      this.hideSidebar = this.isProtectedRoute(this.router.url);
    }
  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const currentRoute = event.urlAfterRedirects;
        console.log('Navigated to:', currentRoute);
        this.hideSidebar = this.isProtectedRoute(currentRoute);
        console.log('Hide Sidebar:', this.hideSidebar);

        if (this.isMobileView && !this.hideSidebar) {
          this.isSidebarOpen = false;
        }
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    if (isPlatformBrowser(this.platformId)) {
      this.checkViewport();
    }
  }

  private checkViewport() {
    this.isMobileView = window.innerWidth < 768;
    this.isSidebarOpen = !this.isMobileView;
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  shouldShowNavbar(): boolean {
    return !this.hideSidebar;
  }

  private isProtectedRoute(url: string): boolean {
    return this.protectedRoutes.some(path => url === path);
  }
}
