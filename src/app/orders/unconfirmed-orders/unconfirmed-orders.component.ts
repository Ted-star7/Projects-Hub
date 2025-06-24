import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ServicesService } from '../../services/consume.service';
import { SessionService } from '../../services/session.service';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-unconfirmed-orders',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule, ReactiveFormsModule],
  templateUrl: './unconfirmed-orders.component.html',
  styleUrls: ['./unconfirmed-orders.component.css']
})
export class UnconfirmedOrdersComponent implements OnInit {
  projects: any[] = [];
  isLoading = true;
  error: string | null = null;
  editForm: FormGroup;
  editingProjectId: string | null = null;
  isEditing = false;

  constructor(
    private servicesService: ServicesService,
    private sessionService: SessionService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.editForm = this.fb.group({
      projectTitle: ['', Validators.required],
      description: ['', Validators.required],
      dueDateTime: ['', Validators.required],
      paymentBudget: ['', Validators.required],
      // Add other fields as needed
    });
  }

  ngOnInit() {
    this.loadUnconfirmedProjects();
  }

  loadUnconfirmedProjects() {
    this.isLoading = true;
    this.error = null;
    
    const userId = this.sessionService.getUserId();
    if (!userId) {
      this.error = 'User not authenticated';
      this.isLoading = false;
      return;
    }

    this.servicesService.getRequest(`/api/open/projects/unconfirmed?userId=${userId}`, this.sessionService.gettoken())
      .subscribe({
        next: (response: any) => {
          this.projects = response;
          this.isLoading = false;
        },
        error: (error) => {
          this.error = 'Failed to load projects';
          this.isLoading = false;
          console.error('Error loading projects:', error);
        }
      });
  }

  startEditing(project: any) {
    this.editingProjectId = project.id;
    this.isEditing = true;
    this.editForm.patchValue({
      projectTitle: project.projectTitle,
      description: project.description,
      dueDateTime: this.formatDateForInput(project.dueDateTime),
      paymentBudget: project.paymentBudget
      // Patch other fields as needed
    });
  }

  cancelEditing() {
    this.isEditing = false;
    this.editingProjectId = null;
    this.editForm.reset();
  }

  submitEdit() {
    if (this.editForm.invalid || !this.editingProjectId) return;

    const updatedProject = {
      ...this.editForm.value,
      id: this.editingProjectId
    };

    this.servicesService.putRequest(
      `/api/open/projects/${this.editingProjectId}`,
      updatedProject,
      this.sessionService.gettoken()
    ).subscribe({
      next: (response) => {
        const index = this.projects.findIndex(p => p.id === this.editingProjectId);
        if (index !== -1) {
          this.projects[index] = { ...this.projects[index], ...updatedProject };
        }
        this.isEditing = false;
        this.editingProjectId = null;
        this.editForm.reset();
      },
      error: (error) => {
        console.error('Error updating project:', error);
        alert('Failed to update project');
      }
    });
  }

  deleteProject(projectId: string) {
    if (confirm('Are you sure you want to delete this project?')) {
      this.servicesService.deleteRequest(`/api/open/projects/${projectId}`, this.sessionService.gettoken())
        .subscribe({
          next: () => {
            this.projects = this.projects.filter(p => p.id !== projectId);
          },
          error: (error) => {
            console.error('Error deleting project:', error);
            alert('Failed to delete project');
          }
        });
    }
  }

  formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  }

  formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16); // YYYY-MM-DDTHH:MM format
  }

  getTimeSince(dateString: string): string {
    const now = new Date();
    const then = new Date(dateString);
    const diff = now.getTime() - then.getTime();
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    
    const minutes = Math.floor(diff / (1000 * 60));
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }

  isUrgent(dueDate: string): boolean {
    const now = new Date();
    const due = new Date(dueDate);
    const diffHours = (due.getTime() - now.getTime()) / (1000 * 60 * 60);
    return diffHours < 48; // Less than 2 days remaining
  }
}