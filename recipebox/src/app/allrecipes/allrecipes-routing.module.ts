import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AllrecipesPage } from './allrecipes.page';

const routes: Routes = [
  {
    path: '',
    component: AllrecipesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllrecipesPageRoutingModule {}
