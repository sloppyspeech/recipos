import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FavoriteRecipesPageRoutingModule } from './favorite-recipes-routing.module';

import { FavoriteRecipesPage } from './favorite-recipes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FavoriteRecipesPageRoutingModule
  ],
  declarations: [FavoriteRecipesPage]
})
export class FavoriteRecipesPageModule {}
