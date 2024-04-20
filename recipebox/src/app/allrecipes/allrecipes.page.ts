import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { ApiService } from '../services/api.service';
import { Recipe } from '../interfaces';

@Component({
  selector: 'app-allrecipes',
  templateUrl: './allrecipes.page.html',
  styleUrls: ['./allrecipes.page.scss'],
})
export class AllrecipesPage implements OnInit {
  recipes: any[];

  constructor(
    private http: HttpClient,
    private _router: Router,
    private authService: AuthService,
    private apiService: ApiService,
    ) {
    this.recipes = []
  }

  ngOnInit() {

    // maybe use different implementation
    // load recipes everytime navigated to page
    this._router.events.subscribe(event => {
      // Check if it's a NavigationEnd event
      if (event instanceof NavigationEnd) {
        // reload recipes
        this.loadRecipes();
      }
    });
  }


  loadRecipes() {
    console.log('Loading recipes...');

    this.apiService.get_all<{ recipes: Recipe[] }>('recipes').subscribe({
      next: (response) => {
        console.log('All recipes response:', response);
        this.recipes = response.recipes;
      },
      error: (error) => {
        console.error('Error getting all recipes:', error);
      },
      complete: () => {},
    });
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
