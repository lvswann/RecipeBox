import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { ApiService } from '../services/api.service';
import { Section, Recipe } from '../interfaces';

@Component({
  selector: 'app-singlesection',
  templateUrl: './singlesection.page.html',
  styleUrls: ['./singlesection.page.scss'],
})
export class SinglesectionPage implements OnInit {
  section: any;
  recipes: any[];
  
  searchQuery: string = '';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private _router: Router,
    private authService: AuthService,
    private apiService: ApiService,
  ) {
    this.recipes = [];
  }


  ngOnInit() {
    this.route.params.subscribe(params => {
      const section_id = params['id'];
      this.loadSection(section_id);
      this.loadSectionRecipes(section_id);
    })
  }

  ionChange(event: any) {
    console.log("search event: ", event.detail.value)
    this.searchQuery = '';
    this._router.navigate(['/search', event.detail.value])
  }

  loadSection(section_id: string) {
    this.apiService.get_with_id<{ section: Section }>('sections', section_id.toString()).subscribe({
      next: (response) => {
        console.log('Section:', response.section);
        this.section = response.section;
      },
      error: (error) => {
        console.error('Error getting section details:', error);
      },
      complete: () => {}
    })
  }


  deleteSection() {
    this.apiService.delete_with_id('sections', this.section.id.toString()).subscribe({
      next: (response) => {
        console.log('Section deleted successfully');
        this.goHome()
      },
      error: (error) => {
        console.error('Section deletion unsuccessful:', error);
      },
      complete: () => {}
    })
  }


  loadSectionRecipes(section_id: string) {
    console.log('Loading recipes...');

    this.apiService.get_all<{ recipes: Recipe[] }>('recipes', `?section_id=${section_id}`).subscribe({
      next: (response) => {
        console.log('All section recipes response:', response);
        this.recipes = response.recipes;
      },
      error: (error) => {
        console.error('Error getting section recipes:', error);
      },
      complete: () => {},
    });
  }

  goToAccount() {
    this._router.navigate(['/useraccount'])
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

  editSection() {
    this._router.navigate(['/newsection', this.section.id])
  }

}
