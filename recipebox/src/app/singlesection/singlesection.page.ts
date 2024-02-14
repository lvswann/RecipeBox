import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-singlesection',
  templateUrl: './singlesection.page.html',
  styleUrls: ['./singlesection.page.scss'],
})
export class SinglesectionPage implements OnInit {

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
