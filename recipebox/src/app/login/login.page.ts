import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { StorageService } from '../auth/storage.service';

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

  constructor(private http: HttpClient, private _router: Router, public formBuilder: FormBuilder,
    private authenticationService:AuthService,
    private storageService:StorageService,) { }

  // public loginForm: any;
  // errorMsg:string=""
  // isSubmitted = false;

  ngOnInit() {
    // this.loginForm = this.formBuilder.group({ 
    //   mobile: new FormControl('', Validators.compose([
    //     Validators.required,
    //     Validators.minLength(10),
    //     Validators.maxLength(10), 
    //   ])),  

    //   password: new FormControl('', Validators.compose([        
    //     Validators.required,
    //     ])),
    //   termsconditions: new FormControl(true,Validators.requiredTrue),

    //   error:new FormControl('')
    // });
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

    //  this.authenticationService.registerUser(this.login);    

 
  }

  userLogin() {

    // this.http.post('http://127.0.0.1:5000/login/', this.login)
    //     .subscribe({
    //       next: (response) => {
    //         console.log('POST Response:', response);
    //         this._router.navigate(['/home'])
    //       },

    //       error: (error) => {
    //         console.error("POST error", error);
    //       },

    //       complete: () => {},
    //   });

    this.authenticationService.login(this.login);   
    // this._router.navigate(['/home'])
    }

  goHome(){
    this._router.navigate(['/home'])
  }

}

