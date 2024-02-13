import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewrecipePageRoutingModule } from './newrecipe-routing.module';

import { NewrecipePage } from './newrecipe.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewrecipePageRoutingModule
  ],
  declarations: [NewrecipePage]
})
export class NewrecipePageModule {}
