import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TextToSpeechService } from '../services/text-to-speech.service';
import { SessionService } from '../services/session.service';
import {
  trigger,
  transition,
  style,
  animate
} from '@angular/animations';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
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
export class DashboardComponent {
  showBanner: boolean = false;

  constructor(
    private router: Router,
    private ttsService: TextToSpeechService,
    private sessionService: SessionService
  ) {}

  playSupportMessage() {
    const message =
      "Hi there! I'm your ScriptHive assistant. You can ask me about posting a project, tracking progress, or how to hire a writer. What do you need help with?";
    this.speak(message);
  }

  playOrderSummary() {
    const summary =
      'You have 2 completed orders, 1 unpaid order, and 3 active projects in progress. Great job keeping up!';
    this.speak(summary);
  }

  speak(text: string) {
    this.ttsService.convertTextToSpeech(text).subscribe(
      (audioBlob) => {
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();
      },
      (error) => {
        console.error('TTS Error:', error);
      }
    );
  }

  navigateTo(route: string) {
    const isActive = this.sessionService.isActive();

    if (!isActive) {
      this.showBanner = true;
      return;
    }

    this.router.navigate([route]);
  }

  closeBanner() {
    this.showBanner = false;
  }
}
