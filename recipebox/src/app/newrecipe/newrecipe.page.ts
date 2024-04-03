import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-newrecipe',
  templateUrl: './newrecipe.page.html',
  styleUrls: ['./newrecipe.page.scss'],
})
export class NewrecipePage implements OnInit {
  sections: any[];

  recipeForm: FormGroup = this.formBuilder.group({
    title: ['', [Validators.required]],
    time: ['', Validators.required],
    time_unit: ['', Validators.required],
    pinned: [false],
    ingredients: this.formBuilder.array([
      this.createIngredientFormGroup()
    ]),
    directions: this.formBuilder.array([
      this.createDirectionFormGroup()
    ]),
    section_ids: [[]]
  });


  constructor(
    private _router: Router,
    private http: HttpClient,
    public formBuilder: FormBuilder,
    private authService: AuthService,
    ) {
      this.sections = [];

    }



  ngOnInit() {
    this.loadSections();
  }

  updatePinned(event: CustomEvent) {
    this.recipeForm.controls['pinned'].setValue(event.detail.checked);
  }

  updateSectionIds(event: CustomEvent) {
    const selected_ids = event.detail.value as number[];
    this.recipeForm.controls['section_ids'].setValue(selected_ids);
  }


  createIngredientFormGroup(): FormGroup {
    return this.formBuilder.group({
      name: ['', Validators.required],
      amount: ['', Validators.required],
      amount_unit: ['', Validators.required]
    });
  }

  createDirectionFormGroup(): FormGroup {
    return this.formBuilder.group({
      description: ['', Validators.required]
    });
  }

  saveRecipe() {
    console.log("Form value:", this.recipeForm.value);
    console.log('Form validity:', this.recipeForm.valid);
    console.log('Form errors:', this.recipeForm.errors);

    if (this.recipeForm.invalid) {
      console.log('recipeForm is invalid');
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
        this.http.post<any>('http://127.0.0.1:5000/recipes/', this.recipeForm.value, { headers })
        .subscribe({
          next: (response) => {
            console.log('Successful new_recipe POST Response:', response);
            // alert("Successful new_recipe POST")
            this.recipeForm.reset()
            // Redirect to single recipe page or any other page
            this._router.navigate(['/allrecipes'])

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

  goToAccount() {
    this._router.navigate(['/useraccount'])
  }


  // Functions for html form

  addIngredient() {
    const ingredient = this.createIngredientFormGroup();
    this.ingredientsArray.push(ingredient);
  }

  removeIngredient(index: number) {
    this.ingredientsArray.removeAt(index);
  }

  get ingredientsArray(): FormArray {
    return this.recipeForm.get('ingredients') as FormArray;
  }



  addDirection() {
    const direction = this.createDirectionFormGroup();
    this.directionsArray.push(direction);
  }

  removeDirection(index: number) {
    this.directionsArray.removeAt(index);
  }

  get directionsArray(): FormArray {
    return this.recipeForm.get('directions') as FormArray;
  }



  loadSections() {
    console.log('Loading sections...');

    this.authService.userInfo$.subscribe(user => {
      if (user && user.sub) {
        const token = user.sub

        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        };

        this.http.get<any>('http://127.0.0.1:5000/sections/', { headers })
          .subscribe({
            next: (response) => {
              console.log('Sections response:', response);
              this.sections = response.sections;

            },
            error: (error) => {
              console.error('Error getting sections:', error);
              // alert('Getting all sections failed');
            },
            complete: () => {},
          });
      }
    });
  }
}
