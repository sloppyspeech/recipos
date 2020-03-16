import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecipesByNamePage } from './recipes-by-name.page';

const routes: Routes = [
  {
    path: '',
    component: RecipesByNamePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecipesByNamePageRoutingModule {}
