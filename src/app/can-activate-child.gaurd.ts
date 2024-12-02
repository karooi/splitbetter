import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

export const canActivateFn: CanActivateFn = () => {
  const dialog = inject(MatDialog);
  if (dialog.openDialogs.length > 0) {
    dialog.closeAll();
    return false;
  } else {
    return true;
  }
};
