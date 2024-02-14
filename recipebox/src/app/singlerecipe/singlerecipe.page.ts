import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';


@Component({
  selector: 'app-singlerecipe',
  templateUrl: './singlerecipe.page.html',
  styleUrls: ['./singlerecipe.page.scss'],
})
export class SinglerecipePage implements OnInit {

  constructor(private _router: Router) { }

  ngOnInit() {
  }

  goHome(){
    this._router.navigate(['/home'])
  }

}
