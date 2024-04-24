import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { ApiService } from '../services/api.service';
import { Recipe, Section } from '../interfaces';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],

})

export class HomePage implements OnInit {
  sections: any[];
  pinned_recipes: any[];


  public appPages = [
    {title: 'All Recipes', url:'allrecipes', icon: 'list-outline'},
    {title: "Add New Recipe", url:"newrecipe", icon: "add-outline"},
    {title: "Add New Section", url:"newsection", icon: "add-outline"}
  ];

  constructor(
    private http: HttpClient,
    private _router: Router,
    private authService: AuthService,
    private apiService: ApiService,
    ) {
    this.sections = [];
    this.pinned_recipes = [];
  }

  ngOnInit() {
    // maybe use different implementation
    // load recipes everytime navigated to page
    this._router.events.subscribe(event => {
      // Check if it's a NavigationEnd event
      if (event instanceof NavigationEnd) {
        // reload
        this.loadSections();
        this.loadPinnedRecipes();
      }
    });
  }

  loadSections() {
    console.log('Loading sections...');

    this.apiService.get_all<{ sections: Section[] }>('sections').subscribe({
      next: (response) => {
        console.log('All sections response:', response);
        this.sections = response.sections;
      },
      error: (error) => {
        console.error('Error getting all sections:', error);
      },
      complete: () => {},
    });
  }


  loadPinnedRecipes() {
    console.log('Loading recipes...');

    this.apiService.get_all<{ recipes: Recipe[] }>('recipes', '?pinned=true').subscribe({
      next: (response) => {
        console.log('All pinned recipes response:', response);
        this.pinned_recipes = response.recipes;
      },
      error: (error) => {
        console.error('Error getting all pinned recipes:', error);
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

  goToAccount() {
    this._router.navigate(['/useraccount'])
  }

  goHome(){
    this._router.navigate(['/home'])
  }

  goNewSection(){
    this._router.navigate(['/newsection'])

    // sometimes does not work
    this.loadSections();
  }

  ionChange(event: any) {
    console.log("search event: ", event.detail.value)
    this._router.navigate(['/search', event.detail.value])
  }

}
