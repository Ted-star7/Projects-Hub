import { Component, OnInit } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ServicesService } from '../../services/consume.service';
import { SessionService } from '../../services/session.service';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

interface Project {
  id: string;
  projectTitle: string;
  category: string;
  dueDate: string;
  dueTime: string;
  description: string;
  numberOfPages?: string;
  citationStyle?: string;
  writingLevel?: string;
  numberOfSources?: string;
  specificTopic?: string;
  currency?: string;
  paymentBudget?: number;
  attachmentsUrlFiles?: string | null;
  programmingLanguages?: string | null;
  framework?: string | null;
  requirements?: string | null;
  status?: string;
  userId?: number;
  user?: any | null;
  repositoryUrl?: string | null;
  hosting?: string | null;
  deployment?: string | null;
  createdAt?: string;
}

interface ApiResponse {
  data: Project | Project[];
  status: string;
}

@Component({
  selector: 'app-unconfirmed-orders',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule, ReactiveFormsModule],
  templateUrl: './unconfirmed-orders.component.html',
  styleUrls: ['./unconfirmed-orders.component.css']
})
export class UnconfirmedOrdersComponent implements OnInit {
  projects: Project[] = [];
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
      dueDate: ['', Validators.required],
      dueTime: ['', Validators.required],
      paymentBudget: ['', Validators.required],
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

    this.servicesService.getRequest(`/api/open/projects/user/${userId}`, this.sessionService.gettoken())
      .subscribe({
        next: (response: ApiResponse) => {
          // Handle both single project and array responses
          if (Array.isArray(response.data)) {
            this.projects = response.data.map(p => ({
              ...p,
              createdAt: p.createdAt || new Date().toISOString()
            }));
          } else {
            this.projects = [{
              ...response.data,
              createdAt: response.data.createdAt || new Date().toISOString()
            }];
          }
          this.isLoading = false;
        },
        error: (error) => {
          this.error = 'Failed to load projects';
          this.isLoading = false;
          console.error('Error loading projects:', error);
        }
      });
  }

  startEditing(project: Project) {
    this.editingProjectId = project.id;
    this.isEditing = true;
    this.editForm.patchValue({
      projectTitle: project.projectTitle,
      description: project.description,
      dueDate: project.dueDate,
      dueTime: project.dueTime,
      paymentBudget: project.paymentBudget
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
      next: (response: any) => {
        const index = this.projects.findIndex(p => p.id === this.editingProjectId);
        if (index !== -1) {
          this.projects[index] = { 
            ...this.projects[index], 
            ...updatedProject 
          };
        }
        this.isEditing = false;
        this.editingProjectId = null;
        this.editForm.reset();
      },
      error: (error) => {
        console.error('Error updating project:', error);
        this.error = 'Failed to update project';
      }
    });
  }

  deleteProject(projectId: string) {
    if (confirm('Are you sure you want to delete this project?')) {
      this.servicesService.deleteRequest(
        `/api/open/projects/${projectId}`, 
        this.sessionService.gettoken()
      ).subscribe({
        next: () => {
          this.projects = this.projects.filter(p => p.id !== projectId);
        },
        error: (error) => {
          console.error('Error deleting project:', error);
          this.error = 'Failed to delete project';
        }
      });
    }
  }

  combineDateTime(dateStr: string, timeStr: string): string {
    if (!dateStr || !timeStr) return new Date().toISOString();
    return `${dateStr}T${timeStr}:00`;
  }

  formatDate(dateTimeStr: string): string {
    if (!dateTimeStr) return 'No due date';
    
    try {
      const date = new Date(dateTimeStr);
      if (isNaN(date.getTime())) return 'Invalid date';
      
      const options: Intl.DateTimeFormatOptions = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      return date.toLocaleDateString('en-US', options);
    } catch (e) {
      return 'Invalid date';
    }
  }

  getTimeSince(dateString: string): string {
    if (!dateString) return 'recently';
    
    try {
      const now = new Date();
      const then = new Date(dateString);
      if (isNaN(then.getTime())) return 'recently';
      
      const diff = now.getTime() - then.getTime();
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
      
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } catch (e) {
      return 'recently';
    }
  }

  isUrgent(dueDateTime: string): boolean {
    if (!dueDateTime) return false;
    
    try {
      const now = new Date();
      const due = new Date(dueDateTime);
      if (isNaN(due.getTime())) return false;
      
      const diffHours = (due.getTime() - now.getTime()) / (1000 * 60 * 60);
      return diffHours < 48; // Less than 2 days remaining
    } catch (e) {
      return false;
    }
  }
}