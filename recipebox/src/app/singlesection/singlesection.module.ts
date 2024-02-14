import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SinglesectionPageRoutingModule } from './singlesection-routing.module';

import { SinglesectionPage } from './singlesection.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SinglesectionPageRoutingModule
  ],
  declarations: [SinglesectionPage]
})
export class SinglesectionPageModule {}
