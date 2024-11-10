import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatListModule, MatListOption, MatSelectionList } from '@angular/material/list';

@Component({
  selector: 'app-group-selection-dialog',
  template: `
    <h2>Select Group</h2>
    <mat-selection-list #groups>
      <mat-list-option *ngFor="let group of availableGroups" (click)="selectGroup(group)">
        {{ group }}
      </mat-list-option>
    </mat-selection-list>
  `,
  standalone: true,
  imports: [MatDialogModule, MatListModule]
})
export class GroupSelectionDialog {
  availableGroups = ['All of Sipidan', 'Group 1', 'Group 2'];

  constructor(public dialogRef: MatDialogRef<GroupSelectionDialog>) {}

  selectGroup(group: string) {
    this.dialogRef.close(group);
  }
}