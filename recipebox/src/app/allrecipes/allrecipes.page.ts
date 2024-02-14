import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-allrecipes',
  templateUrl: './allrecipes.page.html',
  styleUrls: ['./allrecipes.page.scss'],
})
export class AllrecipesPage implements OnInit {

  constructor(private _router: Router) { }

  ngOnInit() {
  }

  goHome(){
    this._router.navigate(['/home'])
  }

  goRecipe() {
    this._router.navigate(['/singlerecipe'])
  }

}
