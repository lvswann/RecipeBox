import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';

// set something to confirm username is entered for registration

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  disableButton: boolean = false;
  isLogin: boolean = true;

  loginForm = this.formBuilder.group({
    username: [''],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });


  constructor(
    private _router: Router,
    public formBuilder: FormBuilder,
    private authService: AuthService,
    ) { }

  ngOnInit() {
  }


  // maybe use one function for login/register
  async login() {

    if (this.loginForm.invalid) {
      console.log('loginForm is invalid');
      return;
    }

    try {
      this.disableButton = true;

      await this.authService.login(this.loginForm.value);
      this.loginForm.reset();

    } catch (error) {
      // Handle login errors
      console.error("Login failed:", error);
    } finally {
      // is this ever reached??
      this.disableButton = false;
    }
  }

  async register() {

    if (this.loginForm.invalid) {
      console.log('loginForm is invalid');
      return;

    }

    try {
      this.disableButton = true;

      await this.authService.register(this.loginForm.value);
      this.loginForm.reset();

    } catch (error) {
      // Handle login errors
      console.error("Registration failed:", error);
    } finally {
      // is this ever reached??
      this.disableButton = false;
    }
  }

  goHome(){
    this._router.navigate(['/home'])
  }

}

