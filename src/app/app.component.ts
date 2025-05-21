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
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Projects-hub';
  hideSidebar = false;
  isSidebarOpen = false;
  isMobileView = false;
  protectedRoutes = ['/', '/login', '/resetpassword', '/registration', '/activate-account'];

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.checkViewport();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    if (isPlatformBrowser(this.platformId)) {
      this.checkViewport();
    }
  }

  private checkViewport() {
    this.isMobileView = window.innerWidth < 768; // Tailwind's md breakpoint
    if (!this.isMobileView) {
      this.isSidebarOpen = true; // Always show sidebar on desktop
    } else {
      this.isSidebarOpen = false; // Start closed on mobile
    }
  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const currentRoute = event.urlAfterRedirects;
        this.hideSidebar = this.protectedRoutes.includes(currentRoute);
        
        // Close sidebar on mobile when navigating
        if (this.isMobileView && !this.hideSidebar) {
          this.isSidebarOpen = false;
        }
      }
    });
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  // Helper function for template type safety
  shouldShowNavbar(): boolean {
    return !this.hideSidebar;
  }
}