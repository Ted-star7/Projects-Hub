import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { SessionService } from '../services/session.service'; 
import {
  trigger,
  transition,
  style,
  animate
} from '@angular/animations';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
    animations: [
    trigger('slideFade', [
      transition(':enter', [
        style({ transform: 'translateY(-10px)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateY(-10px)', opacity: 0 }))
      ])
    ])
  ]
})
export class SidebarComponent {
  @Input() isSidebarOpen: boolean = false;
  @Input() isMobileView: boolean = false;
  @Output() toggleSidebar = new EventEmitter<void>();

  showBanner = false;

  constructor(private router: Router, private sessionService: SessionService) {} // ✅ inject

  dropdowns = {
    orders: false,
    writers: false,
  };

  orderTypes = [
    { name: 'Completed Orders', route: '/orders/completed', icon: 'fas fa-check-circle' },
    { name: 'Post Orders', route: '/orders/post', icon: 'fas fa-plus-circle' },
    { name: 'Orders In Progress', route: '/orders/in-progress', icon: 'fas fa-spinner' },
    { name: 'Unconfirmed Orders', route: '/orders/unconfirmed', icon: 'fas fa-question-circle' },
    { name: 'Submitted Orders', route: '/orders/submitted', icon: 'fas fa-upload' },
    { name: 'Orders in Revision', route: '/orders/revision', icon: 'fas fa-edit' },
    { name: 'Paid Orders', route: '/orders/paid', icon: 'fas fa-dollar-sign' },
    { name: 'Unpaid Orders', route: '/orders/unpaid', icon: 'fas fa-money-bill-alt' },
    { name: 'Disputed Orders', route: '/orders/disputed', icon: 'fas fa-exclamation-circle' },
    { name: 'Request / Bid', route: '/orders/requests', icon: 'fas fa-handshake' }
  ];

  writerTypes = [
    { name: 'Approved Writers', type: 'approved', amount: 0, count: 0 },
    { name: 'Suspended Writers', type: 'suspended', amount: 0, count: 0 },
  ];

  toggleDropdown(menu: string) {
    this.dropdowns[menu as keyof typeof this.dropdowns] =
      !this.dropdowns[menu as keyof typeof this.dropdowns];
  }

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }

  navigateIfActive(route: string) {
    if (!this.sessionService.isActive()) {
      this.showBanner = true;
      setTimeout(() => (this.showBanner = false), 5000);
      return;
    }

    this.router.navigate([route]);
  }
}
