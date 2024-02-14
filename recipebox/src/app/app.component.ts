import { Component } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    {title: 'All Recipes', url:'allrecipes', icon: 'list-outline'},
    {title: "Add New Recipe", url:"newrecipe", icon: "add-outline"},
    {title: "Add New Section", url:"newsection", icon: "add-outline"}
  ];

  constructor(private _router: Router) { }

  goHome(){
    this._router.navigate(['/home'])
  }
}
