import { NgFor, NgIf, isPlatformBrowser } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
  AfterViewInit,
  Inject,
  PLATFORM_ID,
  OnDestroy,
  ViewEncapsulation,
} from '@angular/core';
import * as THREE from 'three';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faUserShield,
  faShieldAlt,
  faTasks,
  faSearch,
  faHeadset,
  faFileAlt,
  faUserPlus,
  faUsers,
  faUpload,
  faCheckCircle,
  faUserSlash,
  faPlay,
  faBars,
  faStar,
} from '@fortawesome/free-solid-svg-icons';
import {
  faTwitter,
  faFacebookF,
  faInstagram,
  faLinkedinIn,
} from '@fortawesome/free-brands-svg-icons';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgFor, NgIf, FontAwesomeModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'], // Ensure this path is correct
  encapsulation: ViewEncapsulation.None // Add this
})

export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('threejsBackground') threejsBackground!: ElementRef;

  mobileMenuOpen = false;
  showRegistrationPopup = false;
  currentYear = new Date().getFullYear();
  isBrowser: boolean;

  navItems = [
    { id: 'hero', label: 'Home' },
    { id: 'try', label: 'Try It Out' },
    { id: 'features', label: 'Features' },
    { id: 'how', label: 'How It Works' },
    { id: 'untrusted', label: 'Untrusted List' },
    { id: 'testimonials', label: 'Testimonials' },
  ];

  features = [
    {
      icon: 'user-shield',
      title: 'Verified Writers',
      description:
        'All writers are vetted to ensure quality and reliability with background checks and sample reviews.',
    },
    {
      icon: 'shield-alt',
      title: 'Secure Payments',
      description:
        'Payments are held in escrow until order completion with money-back guarantees.',
    },
    {
      icon: 'tasks',
      title: 'Order Management',
      description:
        'Assign, reassign, and track order progress with real-time notifications.',
    },
    {
      icon: 'search',
      title: 'Plagiarism Check',
      description:
        'Built-in plagiarism detection ensures all work is original and properly cited.',
    },
    {
      icon: 'headset',
      title: '24/7 Support',
      description:
        'Our support team is available around the clock to assist with any issues.',
    },
    {
      icon: 'file-alt',
      title: 'Quality Samples',
      description:
        'Review writer samples and portfolios before making your selection.',
    },
  ];

  steps = [
    {
      icon: 'user-plus',
      title: 'Register',
      description:
        'Create a student or writer account in seconds with email verification.',
    },
    {
      icon: 'users',
      title: 'Invite Writers',
      description:
        'Add trusted freelancers or explore new talent from our verified pool.',
    },
    {
      icon: 'upload',
      title: 'Post Orders',
      description:
        'Upload work requirements, set deadlines, and assign preferred writers.',
    },
    {
      icon: 'check-circle',
      title: 'Track & Pay',
      description:
        'Monitor delivery progress and complete payments securely upon approval.',
    },
  ];

  untrustedWriters = [
    {
      name: 'writer_ghost001',
      reason: 'Missed 4 deadlines without communication',
    },
    {
      name: 'plagiarizer98',
      reason: 'Multiple plagiarism reports from Turnitin',
    },
    {
      name: 'unresponsive_pro',
      reason: 'No response post assignment for 3+ orders',
    },
    {
      name: 'quality_issues22',
      reason: 'Consistently low-quality submissions',
    },
  ];

  testimonials = [
    {
      name: 'Jane M.',
      role: 'University of Nairobi',
      quote:
        'ScriptHive helped me meet my deadline with zero stress. The writer was professional and responsive throughout the entire process!',
    },
    {
      name: 'Brian K.',
      role: 'Freelance Academic Writer',
      quote:
        'As a freelance writer, ScriptHive provides me with steady gigs and a smooth payment process. The platform is easy to use and the support team is fantastic.',
    },
  ];

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private particles!: THREE.Points;
  private mouseX = 0;
  private mouseY = 0;
  private animationFrameId!: number;

  constructor(
    private faIconLibrary: FaIconLibrary,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    // Add Font Awesome icons
    this.faIconLibrary.addIcons(
      faUserShield,
      faShieldAlt,
      faTasks,
      faSearch,
      faHeadset,
      faFileAlt,
      faUserPlus,
      faUsers,
      faUpload,
      faCheckCircle,
      faUserSlash,
      faPlay,
      faBars,
      faStar,
      faTwitter,
      faFacebookF,
      faInstagram,
      faLinkedinIn
    );
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      window.addEventListener('scroll', this.onScroll.bind(this));
    }
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.initThreeJS();
      this.animate();
    }
  }

  ngOnDestroy(): void {
    if (this.isBrowser) {
      window.removeEventListener('scroll', this.onScroll.bind(this));
      cancelAnimationFrame(this.animationFrameId);

      // Clean up Three.js resources
      if (this.renderer) {
        this.renderer.dispose();
        if (this.threejsBackground?.nativeElement) {
          this.threejsBackground.nativeElement.removeChild(
            this.renderer.domElement
          );
        }
      }
    }
  }

    openRegistrationPopup(): void {
    this.showRegistrationPopup = true;
  }

  closeRegistrationPopup(): void {
    this.showRegistrationPopup = false;
  }

  private initThreeJS(): void {
    if (!this.isBrowser) return;

    // Scene setup
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 30;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.threejsBackground.nativeElement.appendChild(this.renderer.domElement);

    // Particles
    const particleCount = 1000;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200;

      colors[i * 3] = 0.95; // R
      colors[i * 3 + 1] = 0.69; // G
      colors[i * 3 + 2] = 0.21; // B
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 2,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    this.particles = new THREE.Points(particles, particleMaterial);
    this.scene.add(this.particles);

    // Handle window resize
    window.addEventListener('resize', this.onWindowResize.bind(this));

    // Mouse movement for interactive background
    if (this.isBrowser) {
      document.addEventListener('mousemove', (event) => {
        this.mouseX = (event.clientX - window.innerWidth / 2) * 0.0005;
        this.mouseY = (event.clientY - window.innerHeight / 2) * 0.0005;
      });
    }
  }

  private onWindowResize(): void {
    if (!this.isBrowser) return;

    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private animate(): void {
    if (!this.isBrowser) return;

    this.animationFrameId = requestAnimationFrame(() => this.animate());

    // Rotate particles
    this.particles.rotation.x += 0.0005;
    this.particles.rotation.y += 0.001;

    // Move particles based on mouse position
    this.particles.rotation.x += this.mouseY;
    this.particles.rotation.y += this.mouseX;

    this.renderer.render(this.scene, this.camera);
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  scrollTo(id: string): void {
    if (!this.isBrowser) return;

    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  @HostListener('window:scroll', ['$event'])
  private onScroll(): void {
    if (!this.isBrowser) return;

    const elements = document.querySelectorAll('section');
    elements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      if (rect.top < window.innerHeight - 100) {
        element.classList.add('animate-fade-in');
      }
    });
  }
}
