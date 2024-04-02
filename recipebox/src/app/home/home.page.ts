import { Component } from '@angular/core';
import {Router} from '@angular/router';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],

})

export class HomePage {
  sections: any[]

  public appPages = [
    {title: 'All Recipes', url:'allrecipes', icon: 'list-outline'},
    {title: "Add New Recipe", url:"newrecipe", icon: "add-outline"},
    {title: "Add New Section", url:"newsection", icon: "add-outline"}
  ];

  constructor(private http: HttpClient, private _router: Router) {
    this.sections = []
  }

  ngOnInit() {
    this.loadSections()
  }

  loadSections() {
    this.http.get<any>('http://127.0.0.1:5000/sections/').subscribe(response => {
      this.sections = response.sections;
    });
  }

  goHome(){
    this._router.navigate(['/home'])
  }

  goRecipe() {
    this._router.navigate(['/singlerecipe'])
  }

  goSection() {
    this._router.navigate(['/singlesection'])
  }

  goNewSection(){
    this._router.navigate(['/newsection'])
  }

}
