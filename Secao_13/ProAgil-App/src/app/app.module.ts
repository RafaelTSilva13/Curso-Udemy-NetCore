import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { AppRoutingModule } from './app-routing.module';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TabsModule } from 'ngx-bootstrap/tabs'

import { NgxMaskModule } from 'ngx-mask'
import { CurrencyMaskModule } from "ngx-currency-mask";
 
import { ToastrModule } from 'ngx-toastr';
import { EventoService } from './_services/Evento.service';

import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { EventosComponent } from './eventos/eventos.component';
import { PalestrantesComponent } from './palestrantes/palestrantes.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ContatosComponent } from './contatos/contatos.component';
import { TituloComponent } from './_shared/Titulo/Titulo.component';
import { UserComponent } from './user/user.component';
import { LoginComponent } from './user/login/login.component';
import { RegistrationComponent } from './user/registration/registration.component';

import { DateTimeFormatPipePipe } from './_helps/DateTimeFormatPipe.pipe';
import { AuthInterceptor } from './auth/auth.Interceptor';
import { EventoEditComponent } from './eventos/eventoEdit/eventoEdit.component';

@NgModule({
  declarations: [						
    AppComponent,
    NavComponent,
    EventosComponent,
    EventoEditComponent,
    PalestrantesComponent,
    DashboardComponent,
    ContatosComponent,
    TituloComponent,
    UserComponent,
    LoginComponent,
    RegistrationComponent,
    DateTimeFormatPipePipe,
   ],
  imports: [
    CurrencyMaskModule,
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    BsDatepickerModule.forRoot(),
    TooltipModule.forRoot(),
    TabsModule.forRoot(),
    NgxMaskModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
    BrowserAnimationsModule,
    ReactiveFormsModule
  ],
  providers: [ 
    EventoService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
