import { Component } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private _router: Router) { }

  ngOnInit() {
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
