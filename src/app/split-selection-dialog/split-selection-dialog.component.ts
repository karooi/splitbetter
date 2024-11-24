import { Component, Inject, ViewChild } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRipple, MatRippleModule } from '@angular/material/core';
import { MatListModule } from '@angular/material/list';
import { Subscription } from 'rxjs';

export interface User {
  id: number;
  first_name: string;
  owed_share: number;
  selected: Boolean;
}

export interface DialogData {
  creation_method: 'unequal' | 'equally';
  users: any[];
  cost: number;
}

@Component({
  selector: 'app-split-selection-dialog',
  templateUrl: './split-selection-dialog.component.html',
  standalone: true,
  imports: [
    MatDialogModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    FormsModule,
    MatCheckboxModule,
    MatRippleModule,
    MatListModule,
  ],
  styleUrls: ['./split-selection-dialog.component.scss'],
})
export class SplitSelectionDialog {
  remainingAmount = 100; // Example remaining amount for the Unequal tab
  remainingPercentage = 100;
  equalAmount: number = 0;
  selectedTab: number = 0;
  selectAllChecked = false;
  totalAmount: number = 0;
  selectedTabChangeSubscription: Subscription = new Subscription();
  selectedUsers=[]
  constructor(
    public dialogRef: MatDialogRef<SplitSelectionDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {
    this.selectedTab = this.data.creation_method === 'equally' ? 0 : 1;
    this.data.users.forEach((user) => (user.selected = user.owed_share > 0));
    this.totalAmount = this.data.cost;
    this.remainingPercentage = 100;
    this.onTabChange();
    this.selectedTabChangeSubscription = this.dialogRef.afterOpened().subscribe(() => {
      this.onTabChange();
    });
  }

  onTabChange(): void {
    if (this.selectedTab == 0) {
      this.updateEqualSplit(this.data.users.filter((user) => user.selected));
    } else {
      console.log('hi')
      this.updateRemainingAmount();
    }
  }
  get users() {
    return this.data.users;
  }

  set users(value) {
    this.data.users = value;
  }

  get creationMethod() {
    return this.data.creation_method;
  }

  set creationMethod(value) {
    this.data.creation_method = value;
  }

  onBack(): void {
    this.dialogRef.close();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    // Confirm button will pass the updated data back to the parent component
    this.selectedUsers.forEach((user: string) => {
      this.data.users[0].owed_share = this.equalAmount;
    });
    this.data.creation_method = this.selectedTab === 0 ? 'equally' : 'unequal';
    this.dialogRef.close(this.data);
  }

  toggleSelectAll(event: any) {
    this.selectAllChecked = event.checked;
    this.data.users.forEach((user) => (user.selected = this.selectAllChecked));
    this.updateEqualSplit(this.data.users.filter((user) => user.selected));
  }

  updateEqualSplit(users: any) {
    this.selectedUsers = users;
    this.equalAmount =
      this.selectedUsers.length > 0 ? this.data.cost / this.selectedUsers.length : 0;
    this.selectAllChecked = this.data.users.every((user) => user.selected);
  }

  getDisplayName(user: any): string {
    return (user.first_name || '') + ' ' + (user.last_name || '') || user.email;
  }

  updateRemainingAmount() {
    const totalAllocated = this.data.users.reduce(
      (sum, user) => sum + (user.owed_share || 0),
      0
    );
    this.remainingAmount = this.totalAmount - totalAllocated;
  }
}
