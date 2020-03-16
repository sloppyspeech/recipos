import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'folder/Inbox',
    pathMatch: 'full'
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },

  {
    path: 'recipes-by-ingredients',
    loadChildren: () => import('./recipes-by-ingredients/recipes-by-ingredients.module').then( m => m.RecipesByIngredientsPageModule)
  },
  {
    path: 'recipes-by-name',
    loadChildren: () => import('./recipes-by-name/recipes-by-name.module').then( m => m.RecipesByNamePageModule)
  },
  {
    path: 'recipes-tot-time',
    loadChildren: () => import('./recipes-tot-time/recipes-tot-time.module').then( m => m.RecipesTotTimePageModule)
  },
  {
    path: 'favorite-recipes',
    loadChildren: () => import('./favorite-recipes/favorite-recipes.module').then( m => m.FavoriteRecipesPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
