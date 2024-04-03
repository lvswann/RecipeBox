import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],

})

export class HomePage {
  sections: any[];
  recipes: any[];


  public appPages = [
    {title: 'All Recipes', url:'allrecipes', icon: 'list-outline'},
    {title: "Add New Recipe", url:"newrecipe", icon: "add-outline"},
    {title: "Add New Section", url:"newsection", icon: "add-outline"}
  ];

  constructor(
    private http: HttpClient,
    private _router: Router,
    private authService: AuthService
    ) {
    this.sections = [];
    this.recipes = [];
  }

  ngOnInit() {
    this.loadSections();
    this.loadPinnedRecipes();
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

  loadPinnedRecipes() {
    // For now, get all recipes
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

  // Temporary
  logout(): void {
    this.authService.logout().subscribe({
      next: (response) => {
        // alert('Logout Successful');
        this._router.navigate(['/login'])
      },
      error: (error) => {
        console.error('Logout failed:', error)
        // alert('Logout Failed: ' + error.message); // Display detailed error message
      },
      complete: () => {},
    });
  }



  goToRecipe(recipe_id: string) {
    this._router.navigate(['/recipe', recipe_id])
  }

  goToSection(section_id: string) {
    this._router.navigate(['/section', section_id])
  }

  goHome(){
    this._router.navigate(['/home'])
  }

  goNewSection(){
    this._router.navigate(['/newsection'])
    this.loadSections();
  }

}
