import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';

import { NewrecipePageRoutingModule } from './newrecipe-routing.module';

import { NewrecipePage } from './newrecipe.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    NewrecipePageRoutingModule,
    HttpClientModule,
  ],
  declarations: [NewrecipePage]
})
export class NewrecipePageModule {}
