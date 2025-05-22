import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SessionService } from '../services/session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @Input() isMobileView: boolean = false;
  @Input() hideNavbar: boolean = false;
  @Output() toggleSidebar = new EventEmitter<void>();
  
  showDropdown = false;
  userInitials = '';
  fullName = '';

  constructor(
    private sessionService: SessionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    const name = this.sessionService.getfullName();
    if (name) {
      this.fullName = name;
      this.userInitials = this.getInitials(name);
    }
  }

  getInitials(name: string): string {
    return name.split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  navigateToProfile(): void {
    this.showDropdown = false;
    this.router.navigate(['/profile']);
  }

  logout(): void {
    this.sessionService.deleteSessions();
    this.router.navigate(['/login']);
  }

  activateAccount(): void {
    this.showDropdown = false;
    this.router.navigate(['/activate-account']);
  }
}