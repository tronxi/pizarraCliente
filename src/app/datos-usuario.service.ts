import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DatosUsuarioService {
  sala: string;
  color: string;
  tam = 1;
  constructor() { }
}
