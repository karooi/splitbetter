import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { canActivateFn } from './can-activate-child.gaurd';

export const routes: Routes = [
  {
    path: '',
    canActivate: [canActivateFn],
    component: AppComponent,
  },
  {
    path: 'login',
    canActivate: [canActivateFn],
    component: AppComponent,
  },
  { path: '**', redirectTo: '' },
];
