import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core'
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/internal/operators/tap';
import { AuthService } from '../_services/auth.service';

@Injectable({
    providedIn: 'root'
})

export class AuthInterceptor implements HttpInterceptor {
    
    constructor(private router: Router,
                private authService: AuthService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler) : Observable<HttpEvent<any>> {
        if(this.authService.loggedIn())
        {
            const token = localStorage.getItem('token');
            const cloneReq = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${token}`)
            });
            return next.handle(cloneReq).pipe(
                tap(
                    succ => {},
                    error => {
                        if(error.status == 401)
                        {
                            this.router.navigateByUrl('user/login');
                        }
                    }
                )
            )
        }
        else
        {
            return next.handle(req.clone());
        }
    }   
}
