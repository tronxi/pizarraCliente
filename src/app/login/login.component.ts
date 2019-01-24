import { Component, OnInit } from '@angular/core';
import {ConexionBDService} from '../conexion-bd.service';
import {DatosUsuarioService} from '../datos-usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  pizarraCrear: string;
  pizarraUnirse: string;
  constructor(private conex: ConexionBDService,
              private user: DatosUsuarioService,
              private router: Router) { }

  ngOnInit() {
    this.pizarraUnirse = '';
    this.pizarraCrear = '';
  }

  public crearPizarra() {
    if (this.pizarraCrear != '') {
      this.conex.crearPizarra(this.pizarraCrear).subscribe((resultado) => {
        if (resultado == 'existe') {
          alert('la sala ya existe');
        } else if (resultado == 'creada') {
          alert('sala creada correctamente');
        }
      });
    }
  }

  public unirsePizarra() {
    if (this.pizarraUnirse != '') {
      this.conex.comprobarPizarra(this.pizarraUnirse).subscribe((resultado) => {
        if (resultado == 'existe') {
          this.user.sala = this.pizarraUnirse;
          this.router.navigateByUrl('/pizarra');
        } else {
          alert('La pizarra no existe');
        }
      });
    }
  }

}
