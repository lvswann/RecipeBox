import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../services/api.service';
import { Recipe } from '../interfaces';

@Component({
  selector: 'app-singlerecipe',
  templateUrl: './singlerecipe.page.html',
  styleUrls: ['./singlerecipe.page.scss'],
})
export class SinglerecipePage implements OnInit {
  recipe: any;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private _router: Router,
    private apiService: ApiService,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const recipe_id = params['id'];
      this.loadRecipe(recipe_id);
    })
  }

  loadRecipe(recipe_id: string) {
    this.apiService.get_with_id<{ recipe: Recipe }>('recipes', recipe_id.toString()).subscribe({
      next: (response) => {
        console.log('Recipe:', response.recipe);
        this.recipe = response.recipe;
      },
      error: (error) => {
        console.error('Error getting recipe details:', error);
      },
      complete: () => {}
    })
  }


  editRecipe() {
    this._router.navigate(['/newrecipe', this.recipe.id])
    // this.loadRecipe(recipe_id);

  }

  deleteRecipe() {
    this.apiService.delete_with_id('recipes', this.recipe.id.toString()).subscribe({
      next: (response) => {
        console.log('Recipe deleted successfully');
        this.goHome();
      },
      error: (error) => {
        console.error('Recipe deletion unsuccessful:', error);
      },
      complete: () => {}
    })
  }

  updatePin() {
    this.recipe.pinned = !this.recipe.pinned

    this.apiService.put_with_id<any>('recipes', this.recipe.id, {update_pinned: this.recipe.pinned}).subscribe({
      next: (response) => {
        console.log('Recipe pin updated');
      },
      error: (error) => {
        console.error('Error updating recipe pin:', error);
      },
      complete: () => {}
    });
  }

  goHome(){
    this._router.navigate(['/home'])
  }

}
