import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConexionBDService {
  //private url = 'http://192.168.0.5/pizarraServer';
  private url = 'http://raspberrytronxi.ddns.net/pizarraServer';
  constructor(private http: HttpClient) { }

  comprobarPizarra(nombre: string) {
    return this.http.get(this.url + '/pizarra/' + nombre);
  }

  borrarPizarra(nombre: string) {
    return this.http.delete(this.url + '/pizarra/' + nombre);
  }
  crearPizarra(nombre: string) {
    return this.http.post(this.url + '/pizarra', {nombre: nombre});
  }
}
