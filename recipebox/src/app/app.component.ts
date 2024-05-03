import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [

    {title: "Add New Recipe", url:"newrecipe", icon: "fast-food"},
    {title: "Add New Section", url:"newsection", icon: "file-tray-full"},
    {title: 'All Recipes', url:'allrecipes', icon: 'list'},
    {title: 'Settings', url:'useraccount', icon: 'cog'}
  ];

  constructor(private _router: Router) { }

  goHome(){
    this._router.navigate(['/home'])
  }

  searchQuery: string = '';
  
  ionChange(event: any) {
    console.log("search event: ", event.detail.value)
    this.searchQuery = '';
    this._router.navigate(['/search', event.detail.value])
  }
  
  goToAccount() {
    this._router.navigate(['/useraccount'])
  }
}
