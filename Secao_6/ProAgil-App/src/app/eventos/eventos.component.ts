import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Evento } from '../_models/Evento';
import { EventoService } from '../_services/Evento.service';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit{

  _filtroLista: string;
  get filtroLista() : string {
    return this._filtroLista;
  }
  set filtroLista(value: string){
    this._filtroLista = value;
    this.eventosFiltrados = value ? this.filtrarEventos(value) : this.eventos;
  }

  eventosFiltrados: Evento[];
  eventos: Evento[];
  imagemLargura: number = 50;
  imagemMargem = 2;
  mostrarImagem = false;
  modalRef: BsModalRef;
  

  constructor(
    private eventoService: EventoService, 
    private modalService: BsModalService
    ){}

  ngOnInit(){    
    this.getEventos();
  }

  openModal(template: TemplateRef<any>){
    this.modalRef = this.modalService.show(template);
  }

  alternarImagem(){
    this.mostrarImagem = !this.mostrarImagem;
  }

  filtrarEventos(filtrarPor: string) : Evento[] {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(e => e.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1);
  }

  getEventos(){
    this.eventoService.getAllEvento().subscribe(
      (_eventos: Evento[]) => {
        this.eventos = _eventos;
        this.eventosFiltrados = _eventos;
      }, error => {
        console.log(error);
      }
    );
  }
}
