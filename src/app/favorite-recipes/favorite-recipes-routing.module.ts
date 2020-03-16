import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FavoriteRecipesPage } from './favorite-recipes.page';

const routes: Routes = [
  {
    path: '',
    component: FavoriteRecipesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FavoriteRecipesPageRoutingModule {}
