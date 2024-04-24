import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Recipe, Section, TimeUnit } from '../interfaces';


@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  keyword: string = '';
  selectedSortingOption: string = 'dateCreatedDesc';

  // more efficient method??
  recipes: Recipe[] = [];
  sortedRecipes: Recipe[] = [];
  sections: Section[] = [];
  sortedSections: Section[] = [];
  searchType: 'recipes' | 'sections' = 'recipes';

  constructor(
    private _router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService,
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.keyword = params['keyword'];
      this.loadResults(this.keyword);
    })
  }

  loadResults(keyword: string) {
    this.apiService.get_all<any>('search', `?keyword=${keyword}`).subscribe({
      next: (response) => {
        console.log('Results:', response);
        this.recipes = response.recipes;
        this.sections = response.sections;

        this.sort()
      },
      error: (error) => {
        console.error('Error getting search results:', error);
      },
      complete: () => {}
    })

  }

  toggleSearchType() {
    this.searchType = this.searchType === 'recipes' ? 'sections' : 'recipes';
    this.sort()
  }

  goToResult(result_id: string) {
    if (this.searchType === 'recipes') {
      this._router.navigate(['/recipe', result_id]);
    } else if (this.searchType === 'sections') {
      this._router.navigate(['/section', result_id]);
    }
  }


  // change later
  sort() {
    if (this.searchType === 'recipes') {
      this.sortRecipes();
    } else {
      this.sortSections();
    }
  }

  sortRecipes() {
    console.log('Sorting recipes...');
    switch (this.selectedSortingOption) {
      case 'alphabetAsc':
        this.sortedRecipes = this.recipes.slice().sort((a, b) =>
          a.title.localeCompare(b.title)
        );
        break;
      case 'alphabetDesc':
        this.sortedRecipes = this.recipes.slice().sort((a, b) =>
          b.title.localeCompare(a.title)
        );
        break;
      case 'dateCreatedAsc':
        this.sortedRecipes = this.recipes.slice().sort((a, b) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        break;
      case 'dateCreatedDesc':
        this.sortedRecipes = this.recipes.slice().sort((a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        break;
      case 'timeToMakeAsc':
        this.sortedRecipes = this.recipes.slice().sort((a, b) =>
          this.calculateTimeInMinutes(a.time, a.time_unit) - this.calculateTimeInMinutes(b.time, b.time_unit)
        );
        break;
      case 'timeToMakeDesc':
        this.sortedRecipes = this.recipes.slice().sort((a, b) =>
          this.calculateTimeInMinutes(b.time, b.time_unit) - this.calculateTimeInMinutes(a.time, a.time_unit)
        );
        break;
      default:
        this.sortedRecipes = [...this.recipes];
        break;
    }
    console.log('Sorted recipes:', this.sortedRecipes);
  }

  sortSections() {
    console.log('Sorting sections...');
    switch (this.selectedSortingOption) {
      case 'alphabetAsc':
        this.sortedSections = this.sections.slice().sort((a, b) =>
          a.title.localeCompare(b.title)
        );
        break;
      case 'alphabetDesc':
        this.sortedSections = this.sections.slice().sort((a, b) =>
          b.title.localeCompare(a.title)
        );
        break;
      case 'dateCreatedAsc':
        this.sortedSections = this.sections.slice().sort((a, b) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        break;
      case 'dateCreatedDesc':
        this.sortedSections = this.sections.slice().sort((a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        break;
      default:
        this.sortedSections = [...this.sections];
        break;
    }
    console.log('Sorted sections:', this.sortedSections);
  }



  calculateTimeInMinutes(time: number, unit: TimeUnit): number {
    switch (unit) {
      case TimeUnit.HOURS:
        return time * 60;
      default:
        return time;
    }
  }


}
