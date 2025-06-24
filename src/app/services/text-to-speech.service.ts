import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TextToSpeechService {
  private apiKey = 'sk_9b7c29d7f09e700197baa372b198e5feb62435da2c75609b'; // Replace with your real one
  private voiceId = 'EXAVITQu4vr4xnSDxMaL'; // You can change this to your preferred voice
  private apiUrl = `https://api.elevenlabs.io/v1/text-to-speech/${this.voiceId}`;

  constructor(private http: HttpClient) {}

  convertTextToSpeech(text: string): Observable<Blob> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'xi-api-key': this.apiKey
    });

    const body = {
      text: text,
      model_id: 'eleven_monolingual_v1',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75
      }
    };

    return this.http.post(this.apiUrl, body, {
      headers: headers,
      responseType: 'blob'
    });
  }
}
