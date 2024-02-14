import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-newrecipe',
  templateUrl: './newrecipe.page.html',
  styleUrls: ['./newrecipe.page.scss'],
})
export class NewrecipePage implements OnInit {

  recipe = {
    title: '',
    time: '',
    time_unit: '',
    ingredient: '',
    amount: '',
    amount_unit: '',
    directions: '',
  };

  constructor(private http: HttpClient, private _router: Router) { }


  ngOnInit() {
  }

  saveRecipe() {
    this.http.post('http://127.0.0.1:5000/recipes/', this.recipe)
        .subscribe(response => {
            console.log('POST Response:', response);

            // this.router.navigate(['/allrecipes']); // change later
        }, error => {
          console.error("POST error", error);
        });
      }

  cancel() {
    // this.router.navigate(['/home']); // maybe change later
  }

}


  goHome(){
    this._router.navigate(['/home'])
  }

}
