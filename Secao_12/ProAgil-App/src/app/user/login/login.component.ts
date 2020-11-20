import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/_models/User';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  titulo = 'Login';
  model: User = new User();

  constructor(public router: Router,
              private authService: AuthService,
              private toastr: ToastrService) {
              }

  ngOnInit() {
    if(this.authService.loggedIn())
    {
      this.router.navigate(['/dashboard']);
    }
  }

  login(){
    this.authService.login(this.model).subscribe(
      () => {
        this.router.navigate(['/dashboard']);
        this.toastr.success('Logado com Sucesso');
      },
      error => {
        this.toastr.error('Falha ao tentar logar');
      }
    );
  }
}
