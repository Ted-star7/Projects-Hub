import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


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
    title: '',
    category: '',
    description: '',
    tags: '',
    writingDetails: {
      pages: null,
      citationStyle: 'APA',
      wordCount: null,
      sources: null,
      writingLevel: 'Undergraduate',
      topic: ''
    },
    softwareDetails: {
      languages: '',
      framework: '',
      features: '',
      repoUrl: '',
      hostingNeeded: false,
      deploymentSupport: false
    },
    dueDate: '',
    dueTime: '12:00',
    currency: '',
    budget: null,
    allowChat: true,
    ndaRequired: false,
    files: null
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

  get categories() {
    return this.projectType === 'writing' 
      ? this.writingCategories 
      : this.softwareCategories;
  }

  handleFileInput(event: any) {
    this.formData.files = event.target.files;
  }

}
