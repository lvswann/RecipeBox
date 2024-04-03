import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-newsection',
  templateUrl: './newsection.page.html',
  styleUrls: ['./newsection.page.scss'],
})
export class NewsectionPage implements OnInit {

  sectionForm: FormGroup = this.formBuilder.group({
    title: ['', [Validators.required]],
    description: ['', Validators.required],
  });

  constructor(
    private _router: Router,
    private http: HttpClient,
    public formBuilder: FormBuilder,
    private authService: AuthService,
    ) { }

  ngOnInit() {
  }

  saveSection() {
    console.log("Form value:", this.sectionForm.value);
    console.log('Form validity:', this.sectionForm.valid);
    console.log('Form errors:', this.sectionForm.errors);


    if (this.sectionForm.invalid) {
      console.log('sectionForm is invalid');
      return;
    }

    this.authService.userInfo$.subscribe(user => {
      if (user && user.sub) {
        const token = user.sub

        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        };

        // Send POST request with access token in headers
        this.http.post<any>('http://127.0.0.1:5000/sections/', this.sectionForm.value, { headers })
        .subscribe({
          next: (response) => {
            console.log('Successful new_section POST Response:', response);
            this.sectionForm.reset()
            // alert("Successful new_section POST")
            // Redirect to single section page or any other page

            // change to go straight to section page
            this._router.navigate(['/home'])
          },
          error: (error) => {
            console.error("POST error", error);
          },
          complete: () => { },
        });
      } else {
        console.log('User not logged in');
      }
    });
  }



  goHome(){
    this._router.navigate(['/home'])
  }

}
