import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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
    private _router: Router
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const recipe_id = params['id'];
      this.loadRecipe(recipe_id);
    })
  }

  loadRecipe(recipe_id: string) {

    this.http.get<any>(`http://127.0.0.1:5000/recipes/${recipe_id}/`)
    .subscribe({
      next: (response) => {
        console.log('Recipe:', response.recipe);
        this.recipe = response.recipe;
      },
      error: (error) => {
        console.error('Error getting recipe details:', error);
        // alert('Failed to fetch recipe details');
        },
      complete: () => {}
    })
  }

  goHome(){
    this._router.navigate(['/home'])
  }

}
