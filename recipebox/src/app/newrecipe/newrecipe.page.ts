import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

  constructor(private http: HttpClient) { }
  // constructor() { }


  ngOnInit() {
  }

  saveRecipe() {
    this.http.post('http://localhost:5000/recipes', this.recipe)
        .subscribe(response => {
            console.log('POST Response:', response);
        }, error => {
          console.error("POST error", error);
        });

      }


  }


