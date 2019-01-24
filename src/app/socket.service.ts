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
    //this.socket = io('http://raspberrytronxi.ddns.net:8000', {path: '/webchat_server_node_socket'});
    //this.socket = io('http://192.168.0.5:8000', {path: '/webchat_server_node_socket'});
    this.socket = io('http://192.168.0.5:8000', {path: '/pizarraServer_socket'});
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

  public onDibujarPunto(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('dibujar-punto', (data) => observer.next(data));
    });
  }

  public onRecibirDatosIniciales(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('recibir-datos-iniciales', (data) => observer.next(data));
    });
  }
}
