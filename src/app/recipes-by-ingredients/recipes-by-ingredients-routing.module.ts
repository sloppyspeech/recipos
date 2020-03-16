import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecipesByIngredientsPage } from './recipes-by-ingredients.page';

const routes: Routes = [
  {
    path: '',
    component: RecipesByIngredientsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecipesByIngredientsPageRoutingModule {}
