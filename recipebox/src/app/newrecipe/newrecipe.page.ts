import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-newrecipe',
  templateUrl: './newrecipe.page.html',
  styleUrls: ['./newrecipe.page.scss'],
})
export class NewrecipePage implements OnInit {
  sections: any[];
  recipe: any;
  edit: boolean = false;
  sections_exist: boolean = false;

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
    section_ids: [[]] // Initialize with an empty array
  });


  constructor(
    private _router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    public formBuilder: FormBuilder,
    private authService: AuthService,
  ) {
    this.sections = [];
  }

  ngOnInit() {
    this.loadSections();

    this.route.params.subscribe(params => {
      const recipe_id = params['id'];
      if (recipe_id) {
        this.edit = true;
        this.loadRecipe(recipe_id);
      }
    });
  }

  loadRecipe(recipe_id: number) {
    this.http.get<any>(`http://127.0.0.1:5000/recipes/${recipe_id}/`)
      .subscribe({
        next: (response) => {
          console.log('Loading recipe details:', response.recipe);
          this.recipe = response.recipe;
          this.recipeForm.patchValue(this.recipe);
          // Select previously selected sections
          if (this.sections_exist && this.recipe.section_ids.length > 0) {
            this.recipeForm.controls['section_ids'].setValue(this.recipe.section_ids);
          }
          console.log("loading recipes section_ids:", this.recipe.section_ids)
          // const selectedSections = this.recipe.section_ids;
          // if (selectedSections.length > 0) {
          //   this.recipeForm.controls['section_ids'].setValue(selectedSections);
          // } else {
          //   this.recipeForm.controls['section_ids'].setValue([]); // Set to empty array if no sections selected
          // }
        },
        error: (error) => {
          console.error('Error getting recipe details:', error);
        },
        complete: () => {}
      });
  }


  saveRecipe() {

    if (!this.sections_exist) {
      this.recipeForm.controls['section_ids'].setValue([]);
    }

    if (this.recipeForm.invalid) {
      console.log('recipeForm is invalid');
      return;
    }

    console.log("save recipe recipeForm.value: ", this.recipeForm.value)
    this.authService.userInfo$.subscribe(user => {
      if (user && user.sub) {
        const token = user.sub
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        };

        const url = this.edit ? this.http.put<any>(`http://127.0.0.1:5000/recipes/${this.recipe.id}/`, this.recipeForm.value, { headers }) : this.http.post<any>('http://127.0.0.1:5000/recipes/', this.recipeForm.value, { headers });

        // Send PUT or POST request based on editing mode
        url.subscribe({
            next: (response) => {
              console.log(`Successful Response:`, response);
              this.recipeForm.reset();
              this._router.navigate(['/allrecipes']);
            },
            error: (error) => {
              console.error('unsuccessful', error);
            },
            complete: () => {}
          });
      } else {
        console.log('User not logged in');
      }
    });
  }


  updatePinned(event: CustomEvent) {
    this.recipeForm.controls['pinned'].setValue(event.detail.checked);
  }

  updateSectionIds(event: CustomEvent) {
    const selected_ids = event.detail.value as number[];
    this.recipeForm.controls['section_ids'].setValue(selected_ids);
  }


  goHome(){
    this._router.navigate(['/home'])
  }

  goToAccount() {
    this._router.navigate(['/useraccount'])
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
              console.log('Sections response:', response.sections);
              this.sections = response.sections;
              if (this.sections.length > 0) {
                this.sections_exist = true;
              }

            },
            error: (error) => {
              console.error('Error getting sections:', error);
            },
            complete: () => {},
          });
      }
    });
  }
}
