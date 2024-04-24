import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'newrecipe/:id',
    loadChildren: () => import('./newrecipe/newrecipe.module').then( m => m.NewrecipePageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'newrecipe',
    loadChildren: () => import('./newrecipe/newrecipe.module').then( m => m.NewrecipePageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'allrecipes',
    loadChildren: () => import('./allrecipes/allrecipes.module').then( m => m.AllrecipesPageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'recipe/:id',
    loadChildren: () => import('./singlerecipe/singlerecipe.module').then( m => m.SinglerecipePageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'newsection',
    loadChildren: () => import('./newsection/newsection.module').then( m => m.NewsectionPageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'newsection/:id',
    loadChildren: () => import('./newsection/newsection.module').then( m => m.NewsectionPageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'section/:id',
    loadChildren: () => import('./singlesection/singlesection.module').then( m => m.SinglesectionPageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule),
  },
  {
    path: 'useraccount',
    loadChildren: () => import('./useraccount/useraccount.module').then( m => m.UseraccountPageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'search/:keyword',
    loadChildren: () => import('./search/search.module').then( m => m.SearchPageModule),
    canActivate:[AuthGuard]
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
