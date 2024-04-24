import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';


@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  keyword: string;
  recipes: any;
  sections: any;
  searchType: 'recipes' | 'sections' = 'recipes';

  constructor(
    private _router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService,
  ) {
    this.recipes, this.sections = [], [];
    this.keyword = '';
  }

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
      },
      error: (error) => {
        console.error('Error getting search results:', error);
      },
      complete: () => {}
    })

  }

  toggleSearchType() {
    this.searchType = this.searchType === 'recipes' ? 'sections' : 'recipes';
  }

  getResults() {
    return this.searchType === 'recipes' ? this.recipes : this.sections;
  }

  goToResult(result: any) {
    if (this.searchType === 'recipes') {
      this._router.navigate(['/recipe', result.id]);
    } else if (this.searchType === 'sections') {
      this._router.navigate(['/section', result.id]);
    }
  }

}
