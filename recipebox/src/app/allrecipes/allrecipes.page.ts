import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-allrecipes',
  templateUrl: './allrecipes.page.html',
  styleUrls: ['./allrecipes.page.scss'],
})
export class AllrecipesPage implements OnInit {
  recipes: any[];

  constructor(private http: HttpClient, private _router: Router) {
    this.recipes = []
  }

  ngOnInit() {
    this.loadRecipes();
  }

  loadRecipes() {
    this.http.get<any>('http://127.0.0.1:5000/recipes/').subscribe(response => {
      this.recipes = response.recipes;
    });
  }

  goHome(){
    this._router.navigate(['/home'])
  }

  goRecipe() {
    this._router.navigate(['/singlerecipe'])
  }

}
