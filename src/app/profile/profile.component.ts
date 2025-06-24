import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUserCircle, faEdit, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { ServicesService } from '../services/consume.service';
import { SessionService } from '../services/session.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatDividerModule
  ],
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  user: any = {};
  isLoading = false;
  isEditing = false;
  isSubmitting = false;
  profilePicture: string = ''; 
  selectedFile: File | null = null;

  // Icons
  faUserCircle = faUserCircle;
  faEdit = faEdit;
  faSave = faSave;
  faTimes = faTimes;

  constructor(
    private servicesService: ServicesService,
    private sessionService: SessionService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.profileForm = this.fb.group({
      fullName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      bio: ['', Validators.maxLength(500)]
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.isLoading = true;
    const userId = this.sessionService.getUserId();
    const token = this.sessionService.gettoken();

    if (!userId || !token) {
      this.snackBar.open('Please login to view your profile', 'Close', { duration: 3000 });
      return;
    }

    this.servicesService.getRequest(`/api/open/users/${userId}`, token).subscribe({
      next: (res: any) => {
        if (res?.status === 'success' && res.body) {
          this.user = res.body;
          this.profileForm.patchValue({
            fullName: this.user.fullName || '',
            username: this.user.username || '',
            email: this.user.email || '',
            phone: this.user.phone || '',
            bio: this.user.bio || ''
          });
          this.loadProfilePicture(userId, token);
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load user:', err);
        this.snackBar.open('Failed to load profile', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  loadProfilePicture(userId: string, token: string): void {
    this.servicesService.getRequest(`/api/open/users/${userId}/profile-picture`, token).subscribe({
      next: (res: any) => {
        console.log('Profile picture response:', res);
        if (res?.status === 'success' && res.body) {
          this.profilePicture = res.body as string; // ensure it's string
        }
      },
      error: (err) => {
        console.error('Failed to load profile picture:', err);
      }
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.profileForm.reset({
        fullName: this.user.fullName || '',
        username: this.user.username || '',
        email: this.user.email || '',
        phone: this.user.phone || '',
        bio: this.user.bio || ''
      });
    }
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.snackBar.open('Please fill all required fields correctly', 'Close', { duration: 3000 });
      return;
    }

    this.isSubmitting = true;
    const userId = this.sessionService.getUserId();
    const token = this.sessionService.gettoken();
    const updatedData = this.profileForm.value;

    this.servicesService.putRequest(`/api/open/users/${userId}`, updatedData, token).subscribe({
      next: (res) => {
        this.snackBar.open('Profile updated successfully', 'Close', { duration: 3000 });
        this.user = { ...this.user, ...updatedData };
        this.isEditing = false;
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error('Error updating profile:', err);
        this.snackBar.open('Failed to update profile', 'Close', { duration: 3000 });
        this.isSubmitting = false;
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          this.profilePicture = result;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  uploadProfilePicture(): void {
    if (!this.selectedFile) return;

    this.isSubmitting = true;
    const userId = this.sessionService.getUserId();
    const token = this.sessionService.gettoken();
    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.servicesService.postFormData(`/api/open/users/${userId}/profile-picture`, formData, token).subscribe({
      next: (res) => {
        this.snackBar.open('Profile picture updated successfully', 'Close', { duration: 3000 });
        this.isSubmitting = false;
        this.selectedFile = null;
        this.profilePicture = res.body ?? '';

      },
      error: (err) => {
        console.error('Error uploading profile picture:', err);
        this.snackBar.open('Failed to update profile picture', 'Close', { duration: 3000 });
        this.isSubmitting = false;
      }
    });
  }
}
