import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';

export interface AuthResponseData {
    idToken: string,
    email: string,
    refreshToken: string,
    expiresIn: string,
    localId: string,
    registered: boolean
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    tokenExpiratinTimer: any;
    user = new BehaviorSubject<User>(null);

    constructor(private http: HttpClient, private router: Router) { }

    signup(email: string, password: string) {
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBWcypU2FBTX9uOAUoSB2BXw0Dx2v_blmk',
            {
                email: email,
                password: password,
                returnSecureToken: true
            }).pipe(catchError(this.handelError), tap(resData =>{
                this.handelAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
            })
        
        );
    }

    login(email: string, password: string) {
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBWcypU2FBTX9uOAUoSB2BXw0Dx2v_blmk',
            {
                email: email,
                password: password,
                returnSecureToken: true
            }).pipe(catchError(this.handelError), tap(resData =>{
                this.handelAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
            })
        );
    }

    autoLogin(){
        const userData: {
            email: string;
            id: string;
            _token: string;
            _tokenExpiratonDate: string;
        } = JSON.parse(localStorage.getItem('userData'));

        if(!userData){
            return;
        }

        const lodedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpiratonDate));
        if(lodedUser.token){
            this.user.next(lodedUser);
            const expirationDurations =  new Date(userData._tokenExpiratonDate).getTime() - new Date().getTime();
            // this.autoLogout(expirationDurations);
        }
    }

    logOut(){
        this.user.next(null);
        this.router.navigate(['./auth']);
        localStorage.removeItem('userData');
        if(this.tokenExpiratinTimer){
            clearTimeout(this.tokenExpiratinTimer);
        }
        this.tokenExpiratinTimer = null;
    }

    autoLogout(expirationDuration: number){
        this.tokenExpiratinTimer = setTimeout(() =>{
            this.logOut();
        }, expirationDuration);
    }

    private handelAuthentication(email: string, userId: string, token: string, expiresIn: number){
        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
                const user= new User(email, userId, token, expirationDate);
                this.user.next(user);
                this.autoLogout(expiresIn * 1000);
                localStorage.setItem('userData', JSON.stringify(user));
    }

    private handelError(errorRes: HttpErrorResponse) {
        let errorMessage = "An error occurs !!";
        if (!errorRes.error && !errorRes.error.error) {
            return throwError(errorMessage);
        }
        switch (errorRes.error.error.message) {
            case 'EMAIL_EXISTS':
                errorMessage = "This email exists allready!!";
                break;
            case 'EMAIL_NOT_FOUND':
                errorMessage = "EMAIL_NOT_FOUND";
                break;
            case 'INVALID_PASSWORD':
                errorMessage = "INVALID_PASSWORD";
                break;
            case 'USER_DISABLED':
                errorMessage = "USER_DISABLED";
                break;
        }
        return throwError(errorMessage);
    }
}