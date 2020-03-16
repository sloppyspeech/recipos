import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecipesByIngredientsPageRoutingModule } from './recipes-by-ingredients-routing.module';

import { RecipesByIngredientsPage } from './recipes-by-ingredients.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecipesByIngredientsPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [RecipesByIngredientsPage]
})
export class RecipesByIngredientsPageModule {}
