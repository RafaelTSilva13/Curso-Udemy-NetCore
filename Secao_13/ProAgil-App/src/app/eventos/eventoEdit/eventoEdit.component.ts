import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MonoTypeOperatorFunction } from 'rxjs';
import { Evento } from 'src/app/_models/Evento';
import { EventoService } from 'src/app/_services/Evento.service';

@Component({
  selector: 'app-eventoEdit',
  templateUrl: './eventoEdit.component.html',
  styleUrls: ['./eventoEdit.component.scss']
})
export class EventoEditComponent implements OnInit {

  titulo = 'Editar Evento';
  imagemURL = 'assets/img/noImageAvailable.png';
  file: FileList;
  fileName: string;
  dataEvento: string;
  evento: Evento = new Evento();
  registerForm: FormGroup;

  get lotes() : FormArray {
    return <FormArray>this.registerForm.get('lotes');
  }

  get redeSociais() : FormArray {
    return <FormArray>this.registerForm.get('redeSociais');
  }

  constructor(private fb: FormBuilder,
              private eventoService: EventoService,
              private activatedRoute: ActivatedRoute,
              private toastrService : ToastrService) { }

  ngOnInit() {
    this.validation();
    this.carregarEvento();
  }
  
  carregarEvento() {
    const idEvento = +this.activatedRoute.snapshot.paramMap.get('id');
    this.eventoService.getEventoById(idEvento).subscribe(
      (evento: Evento) => {
        this.evento = Object.assign({}, evento);
        this.fileName = evento.imagemURL.toString();
        this.imagemURL = `http://localhost:5000/Resources/Images/${this.evento.imagemURL}?_ts=${this.GetCurrentDate()}`;
        this.evento.imagemURL = '';
        this.registerForm.patchValue(this.evento);

        this.evento.lotes.forEach(lote => {
          this.lotes.push(this.criaLote(lote));
        });

        this.evento.redeSociais.forEach(redeSocial => {
          this.redeSociais.push(this.criaRedeSocial(redeSocial));
        });
      }
    );
  }

  validation(){
    this.registerForm = this.fb.group({
      id: [ ],
      tema: [ '', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      qtdPessoas: ['', [Validators.required, Validators.max(120000)]],
      imagemURL: [ ''],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      lotes: this.fb.array([]),
      redeSociais: this.fb.array([])
    });
  }

  criaLote(lote: any) : FormGroup {
    return this.fb.group({
      id: [lote.id],
      nome: [lote.nome, Validators.required],
      quantidade: [lote.quantidade, Validators.required],
      preco: [lote.preco, Validators.required],
      dataInicio: [lote.dataInicio],
      dataFim: [lote.dataFim]
    });
  }

  criaRedeSocial(redeSocial: any) : FormGroup {
    return this.fb.group({
      id: [redeSocial.id],
      nome: [redeSocial.nome, Validators.required],
      url: [redeSocial.url, Validators.required]
    });
  }

  adicionarLote() {
    this.lotes.push(this.criaLote({ id: 0 }));
  }

  removerLote(id: number) {
    this.lotes.removeAt(id);
  }

  adicionarRedeSocial() {
    this.redeSociais.push(this.criaRedeSocial({ id: 0 }));
  }

  removerRedeSocial(id: number) {
    this.redeSociais.removeAt(id);
  }

  onFileChange(file: FileList){
    const reader = new FileReader();
    reader.onload = (event: any) => {
      this.imagemURL = event.target.result;
      
    }
    this.file = file;
    reader.readAsDataURL(file[0]);
  }

  salvarAlteracoes() {
    this.evento = Object.assign({id: this.evento.id}, this.registerForm.value);

    this.uploadImagem(this.fileName);

    this.eventoService.putEvento(this.evento).subscribe(
      (novoEvento: Evento) =>{
        this.toastrService.success("Evento atualizado com sucesso.");
      },
      error =>{
        this.toastrService.error(`Erro ao atualizar evento: ${error}.`);
      });
  }
  
  uploadImagem(imagemURL: string){
    this.evento.imagemURL = imagemURL;
    if(this.registerForm.get('imagemURL')?.value ?? '' != '')
    {
      this.eventoService.postUpload(this.file, imagemURL)
      .subscribe(
        () => {
          this.imagemURL = `http://localhost:5000/Resources/Images/${this.evento.imagemURL}?_ts=${this.GetCurrentDate()}`;
        });
    }
  }

  GetCurrentDate() : string {
    var today = new Date();
    var date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    return dateTime;
  }
}
