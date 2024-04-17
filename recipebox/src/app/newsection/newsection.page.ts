import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-newsection',
  templateUrl: './newsection.page.html',
  styleUrls: ['./newsection.page.scss'],
})
export class NewsectionPage implements OnInit {

  edit: boolean = false;
  section: any;
  sectionForm: FormGroup = this.formBuilder.group({
    title: ['', [Validators.required]],
    description: ['', Validators.required],
  });

  constructor(
    private _router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    public formBuilder: FormBuilder,
    private authService: AuthService,
    ) { }

  ngOnInit() {

    this.route.params.subscribe(params => {
      const section_id = params['id'];
      if (section_id) {
        this.edit = true;
        this.loadSection(section_id);
      }
    });
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

        const url = this.edit ? this.http.put<any>(`http://127.0.0.1:5000/sections/${this.section.id}/`, this.sectionForm.value, { headers }) : this.http.post<any>('http://127.0.0.1:5000/sections/', this.sectionForm.value, { headers });

        // Send PUT or POST request based on editing mode
        url.subscribe({
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

  loadSection(section_id: string) {

    this.http.get<any>(`http://127.0.0.1:5000/sections/${section_id}/`)
    .subscribe({
      next: (response) => {
        console.log('Section:', response.section);
        this.section = response.section;

        // update form
        this.sectionForm.patchValue(this.section)
      },
      error: (error) => {
        console.error('Error getting section details:', error);
        // alert('Failed to fetch section details');
        },
      complete: () => {}
    })

  }


  goToAccount() {
    this._router.navigate(['/useraccount'])
  }

  goHome(){
    this._router.navigate(['/home'])
  }

}
