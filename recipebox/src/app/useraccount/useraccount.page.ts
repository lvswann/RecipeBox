import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-useraccount',
  templateUrl: './useraccount.page.html',
  styleUrls: ['./useraccount.page.scss'],
})
export class UseraccountPage implements OnInit {

  user: any;
  username: any;
  email: any;

  constructor(
    private http: HttpClient,
    private _router: Router,
    private authService: AuthService
    ) {
    this.email = '';
    this.username = '';
  }

  ngOnInit() {
    this.loadUserInfo()
  }


  loadUserInfo() {
    // For now, get all recipes
    console.log('Loading User Info...');

    this.authService.userInfo$.subscribe(user => {
      if (user && user.sub) {
        const token = user.sub

        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        };

        this.http.get<any>('http://127.0.0.1:5000/useraccount/', { headers })
          .subscribe({
            next: (response) => {
              console.log('User response:', response);
              this.user = response.user;
              this.email = this.user.email;
              this.username = this.user.username;
              console.log(this.username)
              console.log(this.email)

            },
            error: (error) => {
              console.error('Error getting user:', error);
              // alert('Getting all recipes failed');
            },
            complete: () => {},
          });
      }
    });

  }

  // Temporary
  logout(): void {
    this.authService.logout().subscribe({
      next: (response) => {
        // alert('Logout Successful');
        this._router.navigate(['/login'])
      },
      error: (error) => {
        console.error('Logout failed:', error)
        // alert('Logout Failed: ' + error.message); // Display detailed error message
      },
      complete: () => {},
    });
  }

  goToAccount() {
    this._router.navigate(['/useraccount'])
  }

  goHome(){
    this._router.navigate(['/home'])
  }

}
