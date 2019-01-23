import {AfterViewInit, Component, ElementRef, HostListener, OnInit, Renderer, ViewChild} from '@angular/core';
import {SocketService} from '../socket.service';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit, AfterViewInit {

  @ViewChild('canvas') public canvas: ElementRef;

  cx: CanvasRenderingContext2D;
  constructor(private socket: SocketService) { }

  ngOnInit() {
    this.socket.initSocket();
    this.socket.iniciar();
    const cn = this.canvas.nativeElement;
    this.cx = cn.getContext('2d');
    this.cx.strokeRect(0,0, cn.width, cn.height);
    this.socket.onDibujarPunto()
      .subscribe((message) => {
        const json = JSON.parse(message);
        this.dibujar(json.antx, json.anty, json.x, json.y);
      });
    this.socket.onRecibirDatosIniciales()
      .subscribe((message) => {
        for (let i = 0; i < message.length; i++) {
          const json = JSON.parse(message[i]);
          this.dibujar(json.antx, json.anty, json.x, json.y);
        }
      });
  }

  public dibujar(aX, aY, x, y) {
    this.cx.beginPath();
    this.cx.moveTo(aX, aY);
    this.cx.lineTo(x, y);
    this.cx.lineWidth = 5;
    this.cx.stroke();
  }

  ngAfterViewInit(): void {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    const cx = canvasEl.getContext('2d');
    this.captureEvents(canvasEl, this.socket, cx);
  }
  captureEvents(canvas: HTMLCanvasElement, socket, cx) {
    let antX, antY;
    let pulsando = false;
    function dibujar(aX, aY, x, y) {
      cx.beginPath();
      cx.moveTo(aX, aY);
      cx.lineTo(x, y);
      cx.lineWidth = 5;
      cx.stroke();
      const json = JSON.stringify({antx: aX, anty: aY,
        x: x, y: y});
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

    canvas.addEventListener('mousemove', function(event) {
      if (pulsando) {
        const x = event.pageX - canvas.offsetLeft;
        const y = event.pageY - canvas.offsetTop;
        dibujar(antX, antY, x, y);
        antX = x;
        antY = y;
      }
    }, false);
    canvas.addEventListener('mouseup', function(event) {
      pulsando = false;
    }, false);
    canvas.addEventListener('mouseleave', function(event) {
      pulsando = false;
    }, false);
  }


}
