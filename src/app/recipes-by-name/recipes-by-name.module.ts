import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecipesByNamePageRoutingModule } from './recipes-by-name-routing.module';

import { RecipesByNamePage } from './recipes-by-name.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RecipesByNamePageRoutingModule
  ],
  declarations: [RecipesByNamePage]
})
export class RecipesByNamePageModule {}
