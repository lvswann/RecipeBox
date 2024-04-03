import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UseraccountPageRoutingModule } from './useraccount-routing.module';

import { UseraccountPage } from './useraccount.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UseraccountPageRoutingModule
  ],
  declarations: [UseraccountPage]
})
export class UseraccountPageModule {}
