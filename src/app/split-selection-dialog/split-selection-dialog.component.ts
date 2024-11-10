import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatListModule, MatListOption, MatSelectionList } from '@angular/material/list';

@Component({
  selector: 'app-split-selection-dialog',
  template: `
    <h2>Select Split</h2>
    <mat-selection-list #splits>
      <mat-list-option *ngFor="let split of availableSplits" (click)="selectSplit(split)">
        {{ split }}
      </mat-list-option>
    </mat-selection-list>
  `,
  standalone: true,
  imports: [MatDialogModule, MatListModule]

})
export class SplitSelectionDialog {
  availableSplits = ['equally', 'unequally', 'percentage'];

  constructor(public dialogRef: MatDialogRef<SplitSelectionDialog>) {}

  selectSplit(split: string) {
    this.dialogRef.close(split);
  }
}
