import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../services/api.service';
import { Recipe, Section, Ingredient, Direction } from '../interfaces';

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
    private apiService: ApiService,
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

  loadRecipe(recipe_id: string) {
    this.apiService.get_with_id<{ recipe: Recipe }>('recipes', recipe_id.toString()).subscribe({
      next: (response) => {
        console.log('Recipe:', response.recipe);
        this.recipe = response.recipe;

        // Patch the basic recipe details to the form
        this.recipeForm.patchValue(this.recipe);

        // Load ingredients starting from the second one
        const ingredientsArray = this.recipeForm.get('ingredients') as FormArray;
        this.recipe.ingredients.slice(1).forEach((ingredient: Ingredient)  => {
          ingredientsArray.push(this.formBuilder.group({
            name: [ingredient.name, Validators.required],
            amount: [ingredient.amount, Validators.required],
            amount_unit: [ingredient.amount_unit, Validators.required]
          }));
        });

        // Load directions starting from the second one
        const directionsArray = this.recipeForm.get('directions') as FormArray;
        this.recipe.directions.slice(1).forEach((direction: Direction)  => {
          directionsArray.push(this.formBuilder.group({
            description: [direction.description, Validators.required]
          }));
        });


        // // Select previously selected sections
        // if (this.sections_exist && this.recipe.section_ids.length > 0) {
        //   this.recipeForm.controls['section_ids'].setValue(this.recipe.section_ids);
        // }

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
    })
  }

  saveRecipe() {
    console.log('in saveRecipe')

    if (!this.sections_exist) {
      this.recipeForm.controls['section_ids'].setValue([]);
    }

    if (this.recipeForm.invalid) {
      console.log('recipeForm is invalid');
      return;
    }

    console.log("save recipe recipeForm.value: ", this.recipeForm.value)


    if (this.edit) {
      console.log("in edit statement, recipe.id = ", this.recipe.id.toString())
      this.apiService.put_with_id<any>('recipes', this.recipe.id.toString(), this.recipeForm.value).subscribe({
        next: (response) => {
          console.log(`Successful Response:`, response);
          this.recipeForm.reset();
          this.goToRecipe(this.recipe.id);
        },
        error: (error) => {
          console.error('unsuccessful', error);
        },
        complete: () => {}
      });
    } else {
      this.apiService.post<any>('recipes', this.recipeForm.value).subscribe({
        next: (response) => {
          console.log(`Successful Response:`, response);
          this.recipeForm.reset();
          this.goToRecipe(response.recipe_id);
        },
        error: (error) => {
          console.error('unsuccessful', error);
        },
        complete: () => {}
      });
    }
  }

  updateSectionIds(event: CustomEvent) {
    const selected_ids = event.detail.value as number[];
    this.recipeForm.controls['section_ids'].setValue(selected_ids);
  }

  cancel() {
    if (this.edit) {
      this.goToRecipe(this.recipe.id);
    } else {
      this.goHome()
    }
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

    this.apiService.get_all<{ sections: Section[] }>('sections').subscribe({
      next: (response) => {
        console.log('All sections response:', response);
        this.sections = response.sections;
        if (this.sections.length > 0) {
          this.sections_exist = true;
        }
      },
      error: (error) => {
        console.error('Error getting all sections:', error);
      },
      complete: () => {},
    });
  }


  goToRecipe(recipe_id: string) {
    this._router.navigate(['/recipe', recipe_id])
  }

}
