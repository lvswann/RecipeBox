import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor() {}

  appPages = [
    {title: "All Recipes", url:"allrecipes", icon: "list-outline"},
    {title: "Add New Recipe", url:"newrecipe", icon: "add-outline"}
  ]
}
