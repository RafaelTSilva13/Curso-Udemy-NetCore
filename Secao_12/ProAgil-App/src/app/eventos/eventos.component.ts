import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Evento } from '../_models/Evento';
import { EventoService } from '../_services/Evento.service';
import { BsLocaleService } from "ngx-bootstrap/datepicker";
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ptBrLocale } from 'ngx-bootstrap/locale';
import { ToastrService } from 'ngx-toastr';

defineLocale('pt-br', ptBrLocale)

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
  
  titulo = 'Eventos';
  eventosFiltrados: Evento[];
  eventos: Evento[];
  evento: Evento;
  imagemLargura: number = 50;
  imagemMargem = 2;
  mostrarImagem = false;
  modalRef: BsModalRef;
  registerForm: FormGroup;
  bodyDeletarEvento: string;
  dataEvento: string;
  fileName: string;
  dataAtual: string;
  file: File;
  
  constructor(
    private eventoService: EventoService,
    private fb: FormBuilder,
    private localeService: BsLocaleService,
    private toastr: ToastrService
    ){
      this.localeService.use('pt-br');
    }
    
    ngOnInit(){    
      this.validation();
      this.getEventos();
    }
    
    excluirEvento(template: any, evento: Evento){
      this.evento = evento;
      this.bodyDeletarEvento = `Tem certeza que deseja excluir o Evento: ${evento.id} ${evento.tema}`;
      template.show();
    }

    confirmeDelete(template: any){
      this.eventoService.deleteEvento(this.evento).subscribe(
        () =>{
          template.hide();
          this.getEventos();
          this.toastr.success("Evento deletado com sucesso.");
        },
        error =>{
          console.log(error);
          this.toastr.error(`Erro ao deletar evento: ${error}`);
        }    
        );
    }

    editarEvento(template: any, evento: Evento){
      this.openModal(template);
      this.evento = Object.assign({}, evento);
      this.fileName = evento.imagemURL.toString();
      this.evento.imagemURL = '';
      this.registerForm.patchValue(this.evento);
    }
    
    novoEvento(template: any){
      this.openModal(template);
      this.evento = null;
    }
    
    openModal(template: any){
      this.registerForm.reset();
      template.show(template);
    }

    validation(){
      
      this.registerForm = this.fb.group({
        tema: [ '', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
        local: ['', Validators.required],
        dataEvento: ['', Validators.required],
        qtdPessoas: ['', [Validators.required, Validators.max(120000)]],
        imagemURL: [ '', Validators.required],
        telefone: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]]
      });
    }

    onFileChange(event){
      console.log(event);

      if(event.target.files && event.target.files.length)
      {
        this.file = event.target.files;
      }
    }

    uploadImagem(imagemURL: string){
      this.evento.imagemURL = imagemURL;
      this.eventoService.postUpload(this.file, imagemURL)
      .subscribe(
        () => {
          this.dataAtual = this.GetCurrentDate();
          this.getEventos();
        }
      );
    }

    salvarAlteracao(template: any){
      if(this.registerForm.valid)
      {
        if(this.evento == null)
        {
          this.evento = Object.assign({}, this.registerForm.value);

          const nomeArquivo = this.evento.imagemURL.split('\\', 3);
          this.uploadImagem(nomeArquivo[2]);

          this.eventoService.postEvento(this.evento).subscribe(
            (novoEvento: Evento) =>{
              console.log(novoEvento);
              template.hide();
              this.getEventos();
              this.toastr.success("Evento cadastrado com sucesso.");
            },
            error =>{
              this.evento = null;
              console.log(error);
              this.toastr.error(`Erro ao cadastrar evento: ${error}.`);
            }    
            );
          }
          else
          {
            this.evento = Object.assign({id: this.evento.id}, this.registerForm.value);

            this.uploadImagem(this.fileName);

            this.eventoService.putEvento(this.evento).subscribe(
              (novoEvento: Evento) =>{
                console.log(novoEvento);
                template.hide();
                this.getEventos();
                this.toastr.success("Evento atualizado com sucesso.");
              },
              error =>{
                console.log(error);
                this.toastr.error(`Erro ao atualizar evento: ${error}.`);
              }    
              );
            }
          }
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
              this.toastr.error(`Erro ao carregar eventos: ${error}`);
            }
            );
    }

    GetCurrentDate() : string {
      var today = new Date();
      var date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
      var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      var dateTime = date+' '+time;
      return dateTime;
    }
}
        