import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SinglesectionPage } from './singlesection.page';

const routes: Routes = [
  {
    path: '',
    component: SinglesectionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SinglesectionPageRoutingModule {}
