import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SinglerecipePageRoutingModule } from './singlerecipe-routing.module';

import { SinglerecipePage } from './singlerecipe.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SinglerecipePageRoutingModule
  ],
  declarations: [SinglerecipePage]
})
export class SinglerecipePageModule {}
