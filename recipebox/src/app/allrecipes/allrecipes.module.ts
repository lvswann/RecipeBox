import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AllrecipesPageRoutingModule } from './allrecipes-routing.module';

import { AllrecipesPage } from './allrecipes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AllrecipesPageRoutingModule
  ],
  declarations: [AllrecipesPage]
})
export class AllrecipesPageModule {}
