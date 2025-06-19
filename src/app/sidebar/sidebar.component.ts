import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  @Input() isSidebarOpen: boolean = false;
  @Input() isMobileView: boolean = false;
  @Output() toggleSidebar = new EventEmitter<void>();

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
}
