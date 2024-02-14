import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewsectionPageRoutingModule } from './newsection-routing.module';

import { NewsectionPage } from './newsection.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewsectionPageRoutingModule
  ],
  declarations: [NewsectionPage]
})
export class NewsectionPageModule {}
