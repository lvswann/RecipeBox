import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  login = {
    username: '',
    email: '',
    password: ''
  }

  constructor(private http: HttpClient, private _router: Router) { }

  ngOnInit() {
  }

  userRegister() {

    this.http.post('http://127.0.0.1:5000/register/', this.login)
        .subscribe({
          next: (response) => {
            console.log('POST Response:', response);
            this._router.navigate(['/home'])
          },

          error: (error) => {
            console.error("POST error", error);
          },

          complete: () => {},
      });
  }

  userLogin() {

    this.http.post('http://127.0.0.1:5000/login/', this.login)
        .subscribe({
          next: (response) => {
            console.log('POST Response:', response);
            this._router.navigate(['/home'])
          },

          error: (error) => {
            console.error("POST error", error);
          },

          complete: () => {},
      });
    }

  goHome(){
    this._router.navigate(['/home'])
  }

}

