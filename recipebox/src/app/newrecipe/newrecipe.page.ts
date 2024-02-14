import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-newrecipe',
  templateUrl: './newrecipe.page.html',
  styleUrls: ['./newrecipe.page.scss'],
})
export class NewrecipePage implements OnInit {

  constructor(private _router: Router) { }

  ngOnInit() {
  }

  goHome(){
    this._router.navigate(['/home'])
  }

}
