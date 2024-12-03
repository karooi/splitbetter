import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { canActivateFn } from './can-activate-child.gaurd';
import { WelcomeComponent } from './welcome/welcome.component';
import { AddExpenseComponent } from './add-expense/add-expense.component';

export const routes: Routes = [
  { path: 'welcome', component: WelcomeComponent, canActivate: [canActivateFn] },
  { path: '', pathMatch: 'full', component: AddExpenseComponent, canActivate: [canActivateFn] },
  { path: '**', redirectTo: '' }, // Wildcard route for handling invalid paths
];
