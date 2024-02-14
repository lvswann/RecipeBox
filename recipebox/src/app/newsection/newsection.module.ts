import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';

import { NewsectionPageRoutingModule } from './newsection-routing.module';

import { NewsectionPage } from './newsection.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewsectionPageRoutingModule,
    HttpClientModule,
  ],
  declarations: [NewsectionPage]
})
export class NewsectionPageModule {}
