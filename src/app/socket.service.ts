import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import {Observable} from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket;
  constructor() { }

  public initSocket(): void {
    //this.socket = io('http://192.168.0.5', {path: '/pizarraServer_socket'});
    this.socket = io('http://raspberrytronxi.ddns.net', {path: '/pizarraServer_socket'});
  }
  public nuevoPunto(punto): void {
    this.socket.emit('nuevo-punto', punto);
  }

  public iniciar(sala): void {
    this.socket.emit('iniciar', sala);
  }

  public unirse(sala): void {
    this.socket.emit('union', sala);
  }

  public salir(sala): void {
    this.socket.emit('salir', sala);
  }

  public send(message): void {
    this.socket.emit('new-message', message);
  }

  public onDibujarPunto(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('dibujar-punto', (data) => observer.next(data));
    });
  }

  public onMessage(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('message', (data) => observer.next(data));
    });
  }

  public onRecibirDatosIniciales(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('recibir-datos-iniciales', (data) => observer.next(data));
    });
  }
}
