import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewsectionPage } from './newsection.page';

const routes: Routes = [
  {
    path: '',
    component: NewsectionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewsectionPageRoutingModule {}
