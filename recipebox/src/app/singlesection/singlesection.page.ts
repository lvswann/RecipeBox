import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-singlesection',
  templateUrl: './singlesection.page.html',
  styleUrls: ['./singlesection.page.scss'],
})
export class SinglesectionPage implements OnInit {
  section: any;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private _router: Router
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const section_id = params['id'];
      this.loadSection(section_id);
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

  goToAccount() {
    this._router.navigate(['/useraccount'])
  }

  goHome(){
    this._router.navigate(['/home'])
  }

  goRecipe() {
    this._router.navigate(['/singlerecipe'])
  }

}
