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

  login(): void {
    if (this.loginForm.invalid) {
      console.log('loginForm is invalid');
      return;
    }

    // or this.loginForm
    this.authService.loginUser(this.loginForm.value).subscribe({
      next: (response) => {
        // alert('Login Successful');
        this._router.navigate(['/home'])
      },
      error: (error) => {
        console.error('Login Failed:', error);
        // alert('Login Failed: ' + error.message); // Display detailed error message
      },
      complete: () => {},
    });
  }

  register(): void {
    if (this.loginForm.invalid) return;

    // or this.loginForm
    this.authService.registerUser(this.loginForm.value).subscribe({
      next: (response) => {
        console.log('Registration Successful');
        // alert('Registration Successful');

        // login user
        this.authService.loginUser(this.loginForm.value).subscribe({
          next: () => {
            this._router.navigate(['/home']);
          },
          error: () => {
            console.error('Login Failed');

            // alert('Login Failed');
          }
        });
      },
      error: (error) => {
        console.log('Registration Failed');
        // alert('Registration Failed');
      },
      complete: () => {},
    });
  }


  goHome(){
    this._router.navigate(['/home'])
  }

}

