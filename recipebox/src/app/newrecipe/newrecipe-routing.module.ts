import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewrecipePage } from './newrecipe.page';

const routes: Routes = [
  {
    path: '',
    component: NewrecipePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewrecipePageRoutingModule {}
