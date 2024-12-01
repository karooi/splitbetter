import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { CanActivateChildGuard } from './can-activate-child.gaurd';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    canActivateChild: [CanActivateChildGuard],
    component: AppComponent,
  },
  { path: '**', redirectTo: '' },
];
