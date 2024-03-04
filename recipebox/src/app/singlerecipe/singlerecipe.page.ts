import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-singlerecipe',
  templateUrl: './singlerecipe.page.html',
  styleUrls: ['./singlerecipe.page.scss'],
})
export class SinglerecipePage implements OnInit {
  recipe: any;

  constructor(private http: HttpClient, private _router: Router) { }

  ngOnInit() {
 
  }

  goHome(){
    this._router.navigate(['/home'])
  }

}
