import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import axios from 'axios';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('front-end');
  protected readonly backendMessage = signal<string>('Cargando...');

  async ngOnInit() {
    try {
      const response = await axios.get('http://localhost:3000');
      this.backendMessage.set(response.data);
    } catch (error) {
      console.error('Error conectando con el backend:', error);
      this.backendMessage.set('Error al conectar con el backend');
    }
  }
}
