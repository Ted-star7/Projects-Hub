import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUserCircle, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { ServicesService } from '../services/consume.service';
import { SessionService } from '../services/session.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
})
export class ProfileComponent implements OnInit {
  user: any = {};
  isLoading = false;
  isEditing = false;
  isSubmitting = false;
  activationInProgress = false;
  activationMessage = '';
  faUserCircle: IconDefinition = faUserCircle;

  constructor(
    private servicesService: ServicesService,
    private sessionService: SessionService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const userId = this.sessionService.getUserId();
      if (userId) {
        this.loadUser(userId);
      } else {
        console.warn('No user ID found in session');
        // Optionally redirect to login or show message
      }
    }
  }

  loadUser(id: string): void {
    this.isLoading = true;
    console.log('Fetching user with ID:', id);

    this.servicesService.getRequest(`/api/open/users/${id}`, null).subscribe({
      next: (res: any) => {
        console.log('User data loaded:', res);
        if (res?.status === 'success' && res.body) {
          this.user = res.body;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load user:', err);
        this.isLoading = false;
      },
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  onSubmit(): void {
    if (!this.isEditing) return;

    this.isSubmitting = true;
    const userId = this.sessionService.getUserId();
    if (!userId) {
      console.error('No user ID to update');
      this.isSubmitting = false;
      return;
    }

    this.servicesService.putRequest(`/api/open/users/${userId}`, this.user, null).subscribe({
      next: (res) => {
        console.log('User updated successfully:', res);
        this.isSubmitting = false;
        this.isEditing = false;
        // Optionally show a success notification
      },
      error: (err) => {
        console.error('Error updating user:', err);
        this.isSubmitting = false;
        // Optionally show an error notification
      },
    });
  }

  activateAccount(): void {
    this.activationInProgress = true;
    this.activationMessage = '';

    // TODO: Integrate actual Mpesa payment flow here
    setTimeout(() => {
      this.activationInProgress = false;
      this.activationMessage = 'Your account has been activated! You now have premium access.';
    }, 3000);
  }

  onProfilePicChange(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    // TODO: implement upload logic using this.servicesService.postFormData()
    console.log('Selected file for upload:', file);
  }
}
