import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Recipe } from '../interfaces';

@Component({
  selector: 'app-singlerecipe',
  templateUrl: './singlerecipe.page.html',
  styleUrls: ['./singlerecipe.page.scss'],
})
export class SinglerecipePage implements OnInit {
  recipe: Recipe | null = null;

  searchQuery: string = '';

  constructor(
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

  ionChange(event: any) {
    console.log("search event: ", event.detail.value)
    this.searchQuery = '';
    this._router.navigate(['/search', event.detail.value])
  }

  loadRecipe(recipe_id: string) {
    console.log("loading recipe...")
    this.apiService.get_with_id<any>('recipes', recipe_id).subscribe({
      next: (response) => {
        console.log('Load Recipe Response', response)
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
    this._router.navigate(['/newrecipe', this.recipe?.id])
  }

  goToAccount() {
    this._router.navigate(['/useraccount'])
  }

  deleteRecipe() {
    this.apiService.delete_with_id('recipes', this.recipe?.id.toString() || '').subscribe({
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
    if (!this.recipe) return;

    this.recipe.pinned = !this.recipe.pinned

    this.apiService.put_with_id<any>('recipes', this.recipe?.id.toString() || '', {update_pinned: this.recipe.pinned}).subscribe({
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
