import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecipesTotTimePage } from './recipes-tot-time.page';

const routes: Routes = [
  {
    path: '',
    component: RecipesTotTimePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecipesTotTimePageRoutingModule {}
