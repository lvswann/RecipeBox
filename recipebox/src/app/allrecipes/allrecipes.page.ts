import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Recipe, TimeUnit } from '../interfaces';

@Component({
  selector: 'app-allrecipes',
  templateUrl: './allrecipes.page.html',
  styleUrls: ['./allrecipes.page.scss'],
})
export class AllrecipesPage implements OnInit {
  recipes: Recipe[] = [];
  sortedRecipes: Recipe[] = [];
  selectedSortingOption: string = 'dateCreatedDesc';

  constructor(
    private _router: Router,
    private apiService: ApiService,
    ) {}

  ngOnInit() {

    // maybe use different implementation
    this._router.events.subscribe(event => {
      // Check if it's a NavigationEnd event
      if (event instanceof NavigationEnd) {
        // Check if the current route is the all recipes page
        if (event.url === '/allrecipes') {
          // reload recipes
          this.loadRecipes();
        }
      }
    });
  }


  loadRecipes() {
    console.log('Loading recipes...');

    this.apiService.get_all<{ recipes: Recipe[] }>('recipes').subscribe({
      next: (response) => {
        console.log('All recipes response:', response);
        this.recipes = response.recipes;
        this.sortRecipes();
      },
      error: (error) => {
        console.error('Error getting all recipes:', error);
      },
      complete: () => {},
    });
  }


  sortRecipes() {
    console.log('Sorting recipes...');
    switch (this.selectedSortingOption) {
      case 'alphabetAsc':
        this.sortedRecipes = this.recipes.slice().sort((a, b) =>
          a.title.localeCompare(b.title)
        );
        break;
      case 'alphabetDesc':
        this.sortedRecipes = this.recipes.slice().sort((a, b) =>
          b.title.localeCompare(a.title)
        );
        break;
      case 'dateCreatedAsc':
        this.sortedRecipes = this.recipes.slice().sort((a, b) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        break;
      case 'dateCreatedDesc':
        this.sortedRecipes = this.recipes.slice().sort((a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        break;
      case 'timeToMakeAsc':
        this.sortedRecipes = this.recipes.slice().sort((a, b) =>
          this.calculateTimeInMinutes(a.time, a.time_unit) - this.calculateTimeInMinutes(b.time, b.time_unit)
        );
        break;
      case 'timeToMakeDesc':
        this.sortedRecipes = this.recipes.slice().sort((a, b) =>
          this.calculateTimeInMinutes(b.time, b.time_unit) - this.calculateTimeInMinutes(a.time, a.time_unit)
        );
        break;
      default:
        this.sortedRecipes = [...this.recipes];
        break;
    }
    console.log('Sorted recipes:', this.sortedRecipes);
  }

  calculateTimeInMinutes(time: number, unit: TimeUnit): number {
    switch (unit) {
      case TimeUnit.HOURS:
        return time * 60;
      default:
        return time;
    }
  }



  goToAccount() {
    this._router.navigate(['/useraccount'])
  }

  goToRecipe(recipe_id: string) {
    this._router.navigate(['/recipe', recipe_id])
  }

  goHome(){
    this._router.navigate(['/home'])
  }

  goRecipe() {
    this._router.navigate(['/singlerecipe'])
  }

}
