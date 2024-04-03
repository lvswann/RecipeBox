import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';


@Component({
  selector: 'app-singlesection',
  templateUrl: './singlesection.page.html',
  styleUrls: ['./singlesection.page.scss'],
})
export class SinglesectionPage implements OnInit {
  section: any;
  recipes: any[];

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private _router: Router,
    private authService: AuthService
  ) {
    this.recipes = [];
  }


  ngOnInit() {
    this.route.params.subscribe(params => {
      const section_id = params['id'];
      this.loadSection(section_id);
      this.loadRecipes();
    })
  }

  loadSection(section_id: string) {

    this.http.get<any>(`http://127.0.0.1:5000/sections/${section_id}/`)
    .subscribe({
      next: (response) => {
        console.log('Section:', response.section);
        this.section = response.section;
      },
      error: (error) => {
        console.error('Error getting section details:', error);
        // alert('Failed to fetch section details');
        },
      complete: () => {}
    })

  }

  editSection() {

  }

  deleteSection() {
    this.http.delete<any>(`http://127.0.0.1:5000/sections/${this.section.id}/`)
    .subscribe({
      next: (response) => {
        console.log('Section deleted successfully');
        this.goHome()
      },
      error: (error) => {
        console.error('Section deletion unsuccessful:', error);
        // alert('Failed to delete section');
        },
      complete: () => {}
    })
  }


  loadRecipes() {
    console.log('Loading recipes...');

    this.authService.userInfo$.subscribe(user => {
      if (user && user.sub) {
        const token = user.sub

        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        };

        this.http.get<any>('http://127.0.0.1:5000/recipes/', { headers })
          .subscribe({
            next: (response) => {
              console.log('Recipes response:', response);
              this.recipes = response.recipes;
            },
            error: (error) => {
              console.error('Error getting recipes:', error);
              // alert('Getting all recipes failed');
            },
            complete: () => {},
          });
      }
    });
  }


  goHome(){
    this._router.navigate(['/home'])
  }

  goRecipe() {
    this._router.navigate(['/singlerecipe'])
  }

  goToRecipe(recipe_id: string) {
    this._router.navigate(['/recipe', recipe_id])
  }

}
