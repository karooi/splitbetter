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
import { MatSnackBar } from '@angular/material/snack-bar';

export interface User {
  id: number;
  first_name: string;
  owed_share: number;
  selected: Boolean;
}

export interface DialogData {
  creation_method: 'unequally' | 'equally';
  selectedSplit: any[];
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
  selectedUsers: any[] = [];
  selectedSplit: any[] = [];
  selectedOptions: any[] = [];
  constructor(
    public dialogRef: MatDialogRef<SplitSelectionDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.selectedTab = this.data.creation_method === 'equally' ? 0 : 1;
    this.selectedSplit = this.data.selectedSplit || [];
    if (this.selectedSplit.length === 0) {
      this.data.users.forEach((user, index) => {
        this.selectedSplit[index] = {
          userId: user.id,
          owed_share: user.owed_share || 0,
          selected: user.owed_share > 0,
        };
      });
    }
    this.totalAmount = this.data.cost;
    this.remainingPercentage = 100;
    this.onTabChange();
    this.selectedTabChangeSubscription = this.dialogRef
      .afterOpened()
      .subscribe(() => {
        this.onTabChange();
      });
  }

  onTabChange(): void {
    if (this.selectedTab == 0) {
      this.updateEqualSplit();
    } else {
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
    if (this.selectedTab === 0) {
      // check for equal split
      if (this.selectedUsers.length === 0) {
        this.snackbar.open(`Select at least 1 user to split`, 'OK', {
          duration: 5000,
          verticalPosition: 'top',
        });
        return;
      }
      this.selectedSplit
        .filter((u) => u.selected)
        .forEach((split) => {
          split.owed_share = this.equalAmount;
        });
    } else {
      // check for unequal split
      if (this.remainingAmount !== 0) {
        this.snackbar.open(
          `Total owed is ${
            this.remainingPercentage > 0 ? 'under' : 'over'
          } by ${this.remainingAmount}`,
          'OK',
          {
            duration: 5000,
            verticalPosition: 'top',
          }
        );
        return;
      }
    }
    this.data.creation_method =
      this.selectedTab === 0 ? 'equally' : 'unequally';
    this.data.selectedSplit = this.selectedSplit;
    this.dialogRef.close(this.data);
  }

  toggleSelectAll(event: any) {
    this.selectAllChecked = event.checked;
    this.selectedOptions = event.checked
      ? this.selectedSplit.map((split) => split.userId)
      : [];
    this.onSelectionChange();
  }

  onSelectionChange() {
    this.selectedSplit.forEach((split) => {
      split.selected = new Set(this.selectedOptions).has(split.userId)
        ? true
        : false;
    });
    this.updateEqualSplit();
  }

  updateEqualSplit() {
    this.selectedUsers = this.selectedSplit.filter((split) => split.selected);
    this.equalAmount =
      this.selectedUsers.length > 0
        ? this.data.cost / this.selectedUsers.length
        : 0;
    this.selectAllChecked = this.selectedSplit.every((split) => split.selected);
  }

  getDisplayName(user: any): string {
    return (user.first_name || '') + ' ' + (user.last_name || '') || user.email;
  }

  onChangeInput(event: Event, userId: any): void {
    const inputElement = event.target as HTMLInputElement;
    let value = inputElement.value;

    // Clean up preceding 0s
    value = value.replace(/^0+/, '');
    // Remove all non-numeric characters except for the decimal point.
    value = value.replace(/[^0-9.]/g, '');

    // Split into parts before and after the decimal point.
    const [strBeforeDot, strAfterDot] = value.split('.', 2);
    if (strAfterDot && strAfterDot.length > 2) {
      value = strBeforeDot + '.' + strAfterDot.substring(0, 2);
    }
    // Update the input field and the bound model.
    inputElement.value = value;
    this.selectedSplit.forEach((s) => {
      if (s.userId === userId) {
        s.owed_share = value;
      }
    });

    this.updateRemainingAmount();
  }

  updateRemainingAmount() {
    const totalAllocated = parseFloat(
      this.selectedSplit
        .reduce((sum, split) => sum + (parseFloat(split.owed_share) || 0), 0)
        .toFixed(2)
    );
    this.remainingAmount = parseFloat(
      (this.totalAmount - totalAllocated).toFixed(2)
    );
  }
}
