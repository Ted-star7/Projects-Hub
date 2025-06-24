import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TextToSpeechService } from '../services/text-to-speech.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  constructor(private router: Router, private ttsService: TextToSpeechService) {}

  // Static Support Prompt (FAQ-style)
  playSupportMessage() {
    const message = 'Hi there! I\'m your ScriptHive assistant. You can ask me about posting a project, tracking progress, or how to hire a writer. What do you need help with?';
    this.speak(message);
  }

  // Dynamic Example
  playOrderSummary() {
    const summary = 'You have 2 completed orders, 1 unpaid order, and 3 active projects in progress. Great job keeping up!';
    this.speak(summary);
  }

  speak(text: string) {
    this.ttsService.convertTextToSpeech(text).subscribe(audioBlob => {
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    }, error => {
      console.error('TTS Error:', error);
    });
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
