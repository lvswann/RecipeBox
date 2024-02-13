import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SinglerecipePage } from './singlerecipe.page';

const routes: Routes = [
  {
    path: '',
    component: SinglerecipePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SinglerecipePageRoutingModule {}
