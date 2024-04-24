import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Recipe, Section, Ingredient, Direction, TimeUnit } from '../interfaces';

@Component({
  selector: 'app-newrecipe',
  templateUrl: './newrecipe.page.html',
  styleUrls: ['./newrecipe.page.scss'],
})
export class NewrecipePage implements OnInit {
  edit: boolean = false;
  sections_exist: boolean = false;
  disableButton: boolean = false;

  sections: Section[] = [];
  recipe: Recipe | null = null;
  timeUnits: string[] = Object.values(TimeUnit);

  recipeForm: FormGroup = this.formBuilder.group({
    title: ['', [Validators.required]],
    time: ['', [Validators.required]],
    time_unit: ['', [Validators.required]],
    ingredients: this.formBuilder.array([]),
    directions: this.formBuilder.array([]),
    section_ids: [[]]
  });


  constructor(
    private _router: Router,
    private route: ActivatedRoute,
    public formBuilder: FormBuilder,
    private apiService: ApiService,
  ) {}

  ngOnInit() {
    this.loadSections();

    this.route.params.subscribe(params => {
      const recipe_id = params['id'];
      if (recipe_id) {
        this.edit = true;
        this.loadRecipe(recipe_id);
      } else {
        this.addIngredient();
        this.addDirection();
      }
    });
  }

  loadRecipe(recipe_id: string) {
    this.apiService.get_with_id<any>('recipes', recipe_id.toString()).subscribe({
      next: (response) => {
        console.log('Recipe:', response.recipe);
        this.recipe = response.recipe;
        this.patchRecipe(response.section_ids);
      },
      error: (error) => {
        console.error('Error getting recipe details:', error);
      },
      complete: () => {}
    })
  }

  patchRecipe(ids: number[]) {
    if (!this.recipe) {
      return;
    }
    console.log("in patchRecipe")

    this.recipeForm.patchValue({
      title: this.recipe.title,
      time: this.recipe.time,
      time_unit: this.recipe.time_unit,
      section_ids: ids,
    });

    // Load ingredients
    const ingredientsArray = this.recipeForm.get('ingredients') as FormArray;
    this.recipe.ingredients.forEach((ingredient: Ingredient)  => {
      ingredientsArray.push(this.createIngredientFormGroup(ingredient.name, ingredient.amount, ingredient.amount_unit));
    });

    // Load directions
    const directionsArray = this.recipeForm.get('directions') as FormArray;
    this.recipe.directions.forEach((direction: Direction)  => {
      directionsArray.push(this.createDirectionFormGroup(direction.description));
    });
  }


  saveRecipe() {
    this.disableButton = true;

    console.log('in saveRecipe')

    if (!this.sections_exist) {
      this.recipeForm.controls['section_ids'].setValue([]);
    }

    if (this.recipeForm.invalid) {
      console.log('recipeForm is invalid');
      this.disableButton = false;
      return;
    }

    console.log("save recipe recipeForm.value: ", this.recipeForm.value)

    // edit api call
    if (this.edit) {
      console.log("in edit statement, recipe.id = ", this.recipe?.id.toString())
      this.apiService.put_with_id<any>('recipes', this.recipe?.id.toString() || '', this.recipeForm.value).subscribe({
        next: (response) => {
          console.log(`Successful Response:`, response);
          this.recipeForm.reset();
          this.goToRecipe(this.recipe?.id.toString() || '');
        },
        error: (error) => {
          console.error('unsuccessful', error);
        },
        complete: () => {}
      });
    } else {
      // new recipe api call
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
      this.goToRecipe(this.recipe?.id.toString() || '');
    } else {
      this.goHome()
    }
  }

  loadSections() {
    console.log('Loading sections...');

    this.apiService.get_all<{ sections: Section[] }>('sections').subscribe({
      next: (response) => {
        console.log('All sections response:', response);
        this.sections = response.sections;
        this.sections_exist = this.sections.length > 0;
      },
      error: (error) => {
        console.error('Error getting all sections:', error);
      },
      complete: () => {},
    });
  }


  createIngredientFormGroup(name: string = '', amount: number | null = null, amount_unit: string = ''): FormGroup {
    return this.formBuilder.group({
      name: [name, Validators.required],
      amount: [amount, Validators.required],
      amount_unit: [amount_unit, Validators.required]
    });
  }

  createDirectionFormGroup(description: string = ''): FormGroup {
    return this.formBuilder.group({
      description: [description, Validators.required]
    });
  }

  addIngredient() {
    const ingredient = this.createIngredientFormGroup();
    this.ingredientsArray.push(ingredient);
  }

  addDirection() {
    const direction = this.createDirectionFormGroup();
    this.directionsArray.push(direction);
  }


  removeIngredient(index: number) {
    this.ingredientsArray.removeAt(index);
  }

  get ingredientsArray(): FormArray {
    return this.recipeForm.get('ingredients') as FormArray;
  }


  removeDirection(index: number) {
    this.directionsArray.removeAt(index);
  }

  get directionsArray(): FormArray {
    return this.recipeForm.get('directions') as FormArray;
  }


  // navigation
  goHome(){
    this._router.navigate(['/home'])
  }

  goToAccount() {
    this._router.navigate(['/useraccount'])
  }

  goToRecipe(recipe_id: string) {
    this._router.navigate(['/recipe', recipe_id])
  }

}
