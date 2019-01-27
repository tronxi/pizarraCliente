import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DatosUsuarioService {
  sala: string;
  color = '#000000';
  tam = 1;
  constructor() { }
}
