import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UseraccountPage } from './useraccount.page';

const routes: Routes = [
  {
    path: '',
    component: UseraccountPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UseraccountPageRoutingModule {}
