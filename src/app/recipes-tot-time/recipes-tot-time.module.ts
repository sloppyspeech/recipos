import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecipesTotTimePageRoutingModule } from './recipes-tot-time-routing.module';

import { RecipesTotTimePage } from './recipes-tot-time.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecipesTotTimePageRoutingModule
  ],
  declarations: [RecipesTotTimePage]
})
export class RecipesTotTimePageModule {}
