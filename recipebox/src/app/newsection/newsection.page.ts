import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../services/api.service';
import { Section } from '../interfaces';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-newsection',
  templateUrl: './newsection.page.html',
  styleUrls: ['./newsection.page.scss'],
})
export class NewsectionPage implements OnInit {
  disableButton: boolean = false;
  edit: boolean = false;
  section: Section | null = null;;

  searchQuery: string = '';

  sectionForm: FormGroup = this.formBuilder.group({
    title: ['', [Validators.required]],
    description: [''],
  });

  constructor(
    private _router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    public formBuilder: FormBuilder,
    private authService: AuthService,
    private apiService: ApiService,
    public alertController: AlertController,
    ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const section_id = params['id'];
      if (section_id) {
        this.edit = true;
        this.loadSection(section_id);
      }
    });
  }

  ionChange(event: any) {
    console.log("search event: ", event.detail.value)
    this.searchQuery = '';
    this._router.navigate(['/search', event.detail.value])
  }

  async presentAlert(msg:string){
    const alert = await this.alertController.create({
      header:"Alert",
      message: msg,
      buttons: ['OK'],
    });

    await alert.present();
  }

  saveSection() {
    this.disableButton = true;

    if (this.sectionForm.invalid) {
      console.log('sectionForm is invalid');
      if(this.sectionForm.get('title')?.errors) {
        console.log("Invalid title");
        this.presentAlert("Invalid Title")
      }
      this.disableButton = false;

      return;
    }

    if (this.edit) {
      this.apiService.put_with_id<any>('sections', this.section?.id.toString() || '', this.sectionForm.value).subscribe({
        next: (response) => {
          console.log(`Successful Response:`, response);
          this.goToSection(this.section?.id.toString() || '');
        },
        error: (error) => {
          console.error('unsuccessful', error);
        },
        complete: () => {}
      });
    } else {
      this.apiService.post<any>('sections', this.sectionForm.value).subscribe({
        next: (response) => {
          console.log(this.sectionForm.get('title'));
          console.log(this.sectionForm.get('title')?.errors);

          console.log(`Successful Response:`, response);
          this.goToSection(response.section_id);
        },
        error: (error) => {
          console.error('unsuccessful', error);
        },
        complete: () => {}
      });
    }
  }


  loadSection(section_id: string) {
    this.apiService.get_with_id<{ section: Section }>('sections', section_id.toString()).subscribe({
      next: (response) => {
        console.log('Section:', response.section);
        this.section = response.section;

        // update form
        this.sectionForm.patchValue(this.section)
      },
      error: (error) => {
        console.error('Error getting section details:', error);
      },
      complete: () => {}
    })
  }

  cancel() {
    this.sectionForm.reset();

    if (this.edit) {
      this.goToSection(this.section?.id.toString() || '');
    } else {
      this.goHome()
    }
  }

  goToSection(section_id: string) {
    this._router.navigate(['/section', section_id])
  }

  goToAccount() {
    this._router.navigate(['/useraccount'])
  }

  goHome(){
    this._router.navigate(['/home'])
  }

}
