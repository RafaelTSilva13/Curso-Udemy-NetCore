import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  constructor(public authService: AuthService,
              private toastr: ToastrService,
              private router: Router) { }

  ngOnInit() {
  }

  getUserName() : string {
    return this.authService.getUserName();
  }

  login() {
    this.router.navigate(['/user/login']);
  }

  loggedIn() {
    return this.authService.loggedIn();
  }

  logout() {
    this.authService.logout();
    this.toastr.show('Log Out');
    this.router.navigate(['/user/login']);
  }
}
