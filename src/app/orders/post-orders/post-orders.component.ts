import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServicesService } from '../../services/consume.service';
import { SessionService } from '../../services/session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './post-orders.component.html',
  styleUrl: './post-orders.component.css'
})
export class PostOrdersComponent {
  projectType: 'writing' | 'software' | null = null;
  formData = {
    projectTitle: '',
    category: '',
    description: '',
    dueDate: '',
    dueTime: '',
    numberOfPages: null as number | null,
    citationStyle: 'APA',
    writingLevel: 'Undergraduate',
    numberOfSources: null as number | null,
    specificTopic: '',
    currency: '',
    paymentBudget: null as number | null,
    attachmentsUrlFiles: '',
    programmingLanguages: '',
    framework: '',
    requirements: '',
    repositoryUrl: '',
    hosting: '',
    deployment: '',
    files: null as FileList | null
  };

  writingCategories = [
    'Academic Writing',
    'Content Writing',
    'Research Paper',
    'Thesis/Dissertation',
    'Business Writing'
  ];

  softwareCategories = [
    'Web Development',
    'Mobile App',
    'Desktop Application',
    'Database Design',
    'API Development'
  ];

  isLoading = false;
  showPaymentInfoModal = false;
  isDraft = false;

  constructor(
    private servicesService: ServicesService,
    private sessionService: SessionService,
    private router: Router
  ) {}

  get categories() {
    return this.projectType === 'writing' 
      ? this.writingCategories 
      : this.softwareCategories;
  }

  handleFileInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.formData.files = input.files;
    }
  }

  onSubmit(isDraft: boolean = false) {
    this.isDraft = isDraft;
    if (isDraft) {
      this.saveDraft();
    } else {
      this.showPaymentInfoModal = true;
    }
  }

  saveDraft() {
    // Save to localStorage or your preferred storage
    localStorage.setItem('projectDraft', JSON.stringify(this.formData));
    alert('Draft saved successfully!');
  }

  loadDraft() {
    const draft = localStorage.getItem('projectDraft');
    if (draft) {
      this.formData = JSON.parse(draft);
     
    }
  }

  confirmPostProject() {
    this.showPaymentInfoModal = false;
    this.postProject();
  }

  postProject() {
    if (!this.formIsValid() && !this.isDraft) {
      alert('Please fill all required fields');
      return;
    }

    this.isLoading = true;

    const formData = new FormData();
    const projectData = {
      projectTitle: this.formData.projectTitle,
      category: this.formData.category,
      description: this.formData.description,
      dueDate: this.formData.dueDate,
      dueTime: this.formData.dueTime,
      numberOfPages: this.formData.numberOfPages,
      citationStyle: this.formData.citationStyle,
      writingLevel: this.formData.writingLevel,
      numberOfSources: this.formData.numberOfSources,
      specificTopic: this.formData.specificTopic,
      currency: this.formData.currency,
      paymentBudget: this.formData.paymentBudget,
      attachmentsUrlFiles: this.formData.attachmentsUrlFiles,
      programmingLanguages: this.formData.programmingLanguages,
      framework: this.formData.framework,
      requirements: this.formData.requirements,
      repositoryUrl: this.formData.repositoryUrl,
      hosting: this.formData.hosting,
      deployment: this.formData.deployment
    };

    // Remove null/empty values
    const cleanProjectData = JSON.parse(JSON.stringify(projectData, (key, value) => {
      if (value === null || value === '') return undefined;
      return value;
    }));

    formData.append('data', JSON.stringify(cleanProjectData));

    if (this.formData.files) {
      for (let i = 0; i < this.formData.files.length; i++) {
        formData.append('file', this.formData.files[i]);
      }
    }

    const userId = this.sessionService.getUserId();
    if (!userId) {
      alert('User not authenticated');
      this.isLoading = false;
      return;
    }

    const endpoint = `/api/open/projects/create?userId=${userId}`;
    const token = this.sessionService.gettoken();

    this.servicesService.postFormData(endpoint, formData, token).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        console.log('Project created successfully:', response);
        if (!this.isDraft) {
          alert('Project posted successfully! Please complete the payment via the STK push you will receive.');
        } else {
          alert('Draft saved successfully!');
        }
        localStorage.removeItem('projectDraft');
        this.router.navigate(['/projects']);
      },
      error: (error: any) => {
        this.isLoading = false;
        console.error('Error posting project:', error);
        if (error.error) {
          console.error('Server error details:', error.error);
          alert(`Error: ${error.error.message || 'Failed to create project'}`);
        } else {
          alert('An unexpected error occurred. Please try again.');
        }
      }
    });
  }

  private formIsValid(): boolean {
    return !!(
      this.projectType &&
      this.formData.projectTitle &&
      this.formData.category &&
      this.formData.description &&
      this.formData.dueTime &&
      this.formData.dueDate &&
      this.formData.paymentBudget
    );
  }
}