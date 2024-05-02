import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Recipe, Section, Ingredient, Direction, TimeUnit } from '../interfaces';
import { AlertController } from '@ionic/angular';

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
    public alertController: AlertController,
  ) {}

  ngOnInit() {
    // maybe use different implementation
    this._router.events.subscribe(event => {
      // Check if it's a NavigationEnd event
      if (event instanceof NavigationEnd) {
        // Check if the current route matches new recipe
        if (event.url === '/newrecipe') {
          // reload
          this.disableButton = false;
          this.recipeForm.reset();
          if (this.ingredientsArray.length !== 0 || this.directionsArray.length !== 0) this.clearIngredientsDirections();
          this.addIngredient();
          this.addDirection();
        }
      }
    });


    this.loadSections();

    this.route.params.subscribe(params => {
      const recipe_id = params['id'];
      if (recipe_id) {
        this.edit = true;
        if (this.ingredientsArray.length === 0 && this.directionsArray.length === 0) this.loadRecipe(recipe_id);
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

    // check if empty
    if (this.ingredientsArray.length === 0) this.addIngredient();
    if (this.directionsArray.length === 0) this.addDirection();

  }

  async presentAlert(msg:string){
    const alert = await this.alertController.create({
      header:"Alert",
      message: msg,
      buttons: ['OK'],
    });

    await alert.present();
  }

  saveRecipe() {
    this.disableButton = true;

    console.log('in saveRecipe')

    let[total_ing, total_dir] = this.removeEmptyIngredientsDirections();

    if (!this.sections_exist || this.recipeForm.controls['section_ids'].value === null) {
      this.recipeForm.controls['section_ids'].setValue([]);
    }

    console.log("current form:", this.recipeForm.value)


    if (this.recipeForm.invalid) {
      console.log('recipeForm is invalid', this.recipeForm.value);
      if(this.recipeForm.get('title')?.errors) {
        console.log("Invalid title");
        this.presentAlert("Invalid Title")
      }
      else if (this.recipeForm.get('time')?.errors){
        this.presentAlert("Invalid Time")
      }
      else if (this.recipeForm.get('time_unit')?.errors){
        this.presentAlert("Invalid Time Unit")
      }
      else if (total_ing === 0){
        this.presentAlert("Invalid Ingredients")
      }
      else if (total_dir === 0){
        this.presentAlert("Invalid Directions")
      }

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
          this.goToRecipe(this.recipe?.id.toString() || '');
        },
        error: (error) => {
          console.error('unsuccessful', error);
          if (error.status === 400 && error.error.error === 'Recipe title already exists') {
            this.presentAlert("Recipe title already exists");
          }
          this.disableButton = false;
        },
        complete: () => {}
      });
    } else {
      // new recipe api call
      this.apiService.post<any>('recipes', this.recipeForm.value).subscribe({
        next: (response) => {
          console.log(`Successful Response:`, response);
          this.goToRecipe(response.recipe_id);
        },
        error: (error) => {
          console.error('unsuccessful', error);
          if (error.status === 400 && error.error.error === 'Recipe title already exists') {
            this.presentAlert("Recipe title already exists");
          }
          this.disableButton = false;

        },
        complete: () => {}
      });
    }
  }

  updateSectionIds(event: CustomEvent) {
    const selected_ids = event.detail.value as number[];
    this.recipeForm.controls['section_ids'].setValue(selected_ids);
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


  createIngredientFormGroup(name: string = '', amount: number | null = null, amount_unit: string | null = null): FormGroup {
    return this.formBuilder.group({
      name: [name, Validators.required],
      amount: [amount, Validators.required],
      amount_unit: [amount_unit]
    });
  }

  createDirectionFormGroup(description: string = ''): FormGroup {
    return this.formBuilder.group({
      description: [description]
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

  clearIngredientsDirections() {
    while (this.ingredientsArray.length !== 0) {
      this.removeIngredient(0);
    }

    while (this.directionsArray.length !== 0) {
      this.removeDirection(0);
    }
  }

  removeEmptyIngredientsDirections(): [number, number] {

    var total_ing = 0;
    var total_dir = 0;

    for (let i = 0; i < this.ingredientsArray.length; i++){
      console.log("ingredient idx:", i)
      const ingredient = this.ingredientsArray.at(i) as FormGroup;
      const name = ingredient.get('name')?.value;
      const amount = ingredient.get('amount')?.value;
      const amountUnit = ingredient.get('amount_unit')?.value;

      if (!name && !amount && !amountUnit && i!=0) {
        this.removeIngredient(i);
        i -= 1;
      }
      total_ing = i;
    }

    for (let i = 0; i < this.directionsArray.length; i++){
      console.log("direction idx:", i)

      const direction = this.directionsArray.at(i) as FormGroup;
      const description = direction.get('description')?.value;

      if (!description && i!=0) {
        this.removeDirection(i);
        i -= 1;
      }
      total_dir = i;
    }

    return[total_ing, total_dir]

  }


  cancel() {
    this.disableButton = false;
    this.recipeForm.reset();
    if (this.ingredientsArray.length !== 0 || this.directionsArray.length !== 0) this.clearIngredientsDirections();

    if (this.edit) {
      this.goToRecipe(this.recipe?.id.toString() || '');
    } else {
      this.goHome()
    }
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
