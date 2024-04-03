import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';

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

    this.authService.userInfo$.subscribe(user => {
      if (user && user.sub) {
        const token = user.sub

        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        };

        this.http.get<any>('http://127.0.0.1:5000/recipes/', { headers })
          .subscribe({
            next: (response) => {
              console.log('Recipes response:', response);
              this.recipes = response.recipes;
            },
            error: (error) => {
              console.error('Error getting recipes:', error);
              // alert('Getting all recipes failed');
            },
            complete: () => {},
          });
      }
    });
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
