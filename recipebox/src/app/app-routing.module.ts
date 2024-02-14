import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'newrecipe',
    loadChildren: () => import('./newrecipe/newrecipe.module').then( m => m.NewrecipePageModule)
  },
  {
    path: 'allrecipes',
    loadChildren: () => import('./allrecipes/allrecipes.module').then( m => m.AllrecipesPageModule)
  },
  {
    path: 'singlerecipe',
    loadChildren: () => import('./singlerecipe/singlerecipe.module').then( m => m.SinglerecipePageModule)
  },
  {
    path: 'newsection',
    loadChildren: () => import('./newsection/newsection.module').then( m => m.NewsectionPageModule)
  },
  {
    path: 'singlesection',
    loadChildren: () => import('./singlesection/singlesection.module').then( m => m.SinglesectionPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
