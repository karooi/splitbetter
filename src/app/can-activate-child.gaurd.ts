import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

export const canActivateFn: CanActivateFn = (route, state) => {
  const dialog = inject(MatDialog);
  const router = inject(Router); // Inject the Router

  const apiKey = localStorage.getItem('apiKey');
  console.log(apiKey);
  if (!apiKey && state.url !== '/welcome') {
    dialog.closeAll();
    return router.parseUrl('/welcome');
  }

  if (dialog.openDialogs.length > 0) {
    dialog.closeAll();
    return false;
  } else {
    return true;
  }
};
