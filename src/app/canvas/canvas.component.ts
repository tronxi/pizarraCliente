import {AfterViewInit, Component, ElementRef, HostListener, OnInit, Renderer, ViewChild, OnDestroy} from '@angular/core';
import {SocketService} from '../socket.service';
import {DatosUsuarioService} from '../datos-usuario.service';
import {ConexionBDService} from '../conexion-bd.service';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('canvas') public canvas: ElementRef;
  color: any;
  cx: CanvasRenderingContext2D;
  constructor(private socket: SocketService,
              private user: DatosUsuarioService,
              private conex: ConexionBDService) { }

  ngOnInit() {
    this.socket.initSocket();
    this.socket.unirse(this.user.sala);
    this.socket.iniciar(this.user.sala);
    const cn = this.canvas.nativeElement;
    this.cx = cn.getContext('2d');
    this.cx.strokeRect(0,0, cn.width, cn.height);
    this.socket.onDibujarPunto()
      .subscribe((message) => {
        const json = JSON.parse(message);
        this.dibujar(json.antx, json.anty, json.x, json.y, json.color, json.tam);
      });
    this.socket.onRecibirDatosIniciales()
      .subscribe((message) => {
        this.cx.clearRect(0,0, cn.width, cn.height);
        this.cx.strokeRect(0,0, cn.width, cn.height);
        for (let i = 1; i < message.length; i++) {
          this.dibujar(message[i].antx, message[i].anty, message[i].x, message[i].y,
            message[i].color, message[i].tam);
        }
      });
  }

  ngOnDestroy(): void {
    this.socket.salir(this.user.sala);
    this.user.sala = null;
  }

  public dibujar(aX, aY, x, y, color, tam) {
    this.cx.beginPath();
    this.cx.moveTo(aX, aY);
    this.cx.lineTo(x, y);
    this.cx.lineWidth = tam;
    this.cx.strokeStyle = color;
    this.cx.stroke();
  }

  ngAfterViewInit(): void {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    const cx = canvasEl.getContext('2d');
    this.captureEvents(canvasEl, this.socket, cx, this.user);
  }
  captureEvents(canvas: HTMLCanvasElement, socket, cx, user) {
    let antX, antY;
    let pulsando = false;
    function dibujar(aX, aY, x, y) {
      cx.beginPath();
      cx.moveTo(aX, aY);
      cx.lineTo(x, y);
      cx.lineWidth = user.tam;
      cx.strokeStyle = user.color;
      cx.stroke();
      const json = JSON.stringify({sala: user.sala , antx: aX, anty: aY,
        x: x, y: y, color: user.color, tam: user.tam});
      socket.nuevoPunto(json);
    }
    canvas.addEventListener('mousedown', function(event) {
      pulsando = true;
      const x = event.pageX - canvas.offsetLeft;
      const y = event.pageY - canvas.offsetTop;
      antX = x;
      antY = y;
      dibujar(antX, antY, x, y);
    }, false);
    canvas.addEventListener('touchstart', function(event) {
      pulsando = true;
      const x = event.touches.item(0).pageX - canvas.offsetLeft;
      const y = event.touches.item(0).pageY - canvas.offsetTop;
      antX = x;
      antY = y;
      dibujar(antX, antY, x, y);
    }, false);

    canvas.addEventListener('mousemove', function(event) {
      if (pulsando) {
        const x = event.pageX - canvas.offsetLeft;
        const y = event.pageY - canvas.offsetTop;
        dibujar(antX, antY, x, y);
        antX = x;
        antY = y;
      }
    }, false);
    canvas.addEventListener('touchmove', function(event) {
      if (pulsando) {
        const x = event.touches.item(0).pageX - canvas.offsetLeft;
        const y = event.touches.item(0).pageY - canvas.offsetTop;
        dibujar(antX, antY, x, y);
        antX = x;
        antY = y;
      }
    }, false);

    canvas.addEventListener('mouseup', function(event) {
      pulsando = false;
    }, false);
    canvas.addEventListener('touchend', function(event) {
      pulsando = false;
    }, false);

    canvas.addEventListener('mouseleave', function(event) {
      pulsando = false;
    }, false);
    canvas.addEventListener('touchleave', function(event) {
      pulsando = false;
    }, false);
  }

  subirTam() {
    this.user.tam++;
  }
  bajarTam() {
    if (this.user.tam >= 2) {
      this.user.tam--;
    }
  }

  borrar() {
    this.conex.borrarPizarra(this.user.sala).subscribe((valor) => {
      this.socket.iniciar(this.user.sala);
    });

  }

}
