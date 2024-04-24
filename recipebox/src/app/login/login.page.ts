import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm = this.formBuilder.group({
    username: [''],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });
  isLogin: boolean = true;


  constructor(
    private _router: Router,
    public formBuilder: FormBuilder,
    private authService: AuthService,
    ) { }

  ngOnInit() {
  }

  async login() {
    if (this.loginForm.invalid) {
      console.log('loginForm is invalid');
      return;
    }

    try {
      await this.authService.login(this.loginForm.value);
      // this.loginForm.reset();

    } catch (error) {
      // Handle login errors, such as displaying an error message to the user
      console.error("Login failed:", error);
    }
  }



  async register() {
    if (this.loginForm.invalid) return;

    try {
      await this.authService.register(this.loginForm.value);

    } catch (error) {
      // Handle login errors, such as displaying an error message to the user
      console.error("Registration failed:", error);
    }
  }


  goHome(){
    this._router.navigate(['/home'])
  }

}

