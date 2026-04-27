import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { pruebaCon } from './conexion';

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
    console.log('Intentando conectar con el backend...');
    try {
      const data = await pruebaCon();
      console.log('Respuesta recibida:', data);
      this.backendMessage.set(data);
    } catch (error) {
      console.error('Error detallado:', error);
      this.backendMessage.set('Error al conectar con el backend');
    }
  }
}
