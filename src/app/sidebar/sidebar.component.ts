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
    { name: 'Completed Orders', amount: 0, count: 0 },
    { name: 'P Orders', amount: 0, count: 0 },
    { name: 'Orders In Progress', amount: 0, count: 0 },
    { name: 'Unconfirmed Orders', amount: 0, count: 0 },
    { name: 'Submitted Orders', amount: 0, count: 0 },
    { name: 'Orders in Revision', amount: 0, count: 0 },
    { name: 'Paid Orders', amount: 0, count: 0 },
    { name: 'Unpaid Orders', amount: 0, count: 0 },
    { name: 'Disputed Orders', amount: 0, count: 0 },
    { name: 'Request / Bid', amount: 0, count: 0 },
    { name: 'Canceled Orders', amount: 0, count: 0 },
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