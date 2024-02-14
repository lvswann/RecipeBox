import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-newsection',
  templateUrl: './newsection.page.html',
  styleUrls: ['./newsection.page.scss'],
})
export class NewsectionPage implements OnInit {

  constructor(private _router: Router) { }

  ngOnInit() {
  }

  goHome(){
    this._router.navigate(['/home'])
  }

}
