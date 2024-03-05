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
    password: ''
  }

  constructor(private http: HttpClient, private _router: Router) { }

  ngOnInit() {
  }
  
  saveRecipe() {

    this.http.post('http://127.0.0.1:5000/login/', this.login)
        .subscribe({
          next: (response) => {
            console.log('POST Response:', response);
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
