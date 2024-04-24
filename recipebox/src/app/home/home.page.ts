import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Recipe, Section } from '../interfaces';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],

})

export class HomePage implements OnInit {
  searchQuery: string = '';

  sections: Section[] = [];
  pinned_recipes: Recipe[] = [];


  public appPages = [
    {title: 'All Recipes', url:'allrecipes', icon: 'list-outline'},
    {title: "Add New Recipe", url:"newrecipe", icon: "add-outline"},
    {title: "Add New Section", url:"newsection", icon: "add-outline"}
  ];

  constructor(
    private _router: Router,
    private apiService: ApiService,
    ) {}

  ngOnInit() {
    // maybe use different implementation
    this._router.events.subscribe(event => {
      // Check if it's a NavigationEnd event
      if (event instanceof NavigationEnd) {
        // Check if the current route is the home page
        if (event.url === '/' || event.url === '/home') {
          // reload
          this.loadSections();
          this.loadPinnedRecipes();
        }
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
    console.log('Loading pinned recipes...');

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
  }

  ionChange(event: any) {
    console.log("search event: ", event.detail.value)
    this.searchQuery = '';
    this._router.navigate(['/search', event.detail.value])
  }

}
