import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRipple, MatRippleModule } from '@angular/material/core';

export interface User {
  id: number;
  first_name: string;
  owed_share: number;
  selected: Boolean ;
}

export interface DialogData {
  creation_method: 'unequal' | 'equal';
  users: any[];
  cost: number;
}

@Component({
  selector: 'app-split-selection-dialog',
  templateUrl: './split-selection-dialog.component.html',
  standalone: true,
  imports: [MatDialogModule, MatTabsModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule, CommonModule, FormsModule, MatCheckboxModule, MatRippleModule],
  styleUrls: ['./split-selection-dialog.component.scss']
})

export class SplitSelectionDialog {
  remainingAmount = 100; // Example remaining amount for the Unequal tab
  remainingPercentage = 100; 
  equalAmount: number = 0;
  selectedTab: number = 0;
  selectAllChecked = false;
  constructor(
    public dialogRef: MatDialogRef<SplitSelectionDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {this.selectedTab = 
    this.data.creation_method === 'equal' ? 0 : 1;
    this.data.users.forEach(user => (user.selected = user.owed_share > 0));
    this.selectAllChecked = this.data.users.every(user => user.selected);;
  }

  onTabChange(): void {
    if (this.selectedTab === 0) {
      this.updateEqualSplit();
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
    this.data.creation_method=this.selectedTab === 0 ? 'equal' : 'unequal';
    this.dialogRef.close(this.data);
  }

  toggleSelectAll(event: any) {
    this.selectAllChecked = event.checked;
    this.data.users.forEach(user => (user.selected = this.selectAllChecked));
    this.updateEqualSplit();
  }

  updateEqualSplit() {
    const selectedUsers = this.data.users.filter(user => user.selected);
    this.equalAmount = selectedUsers.length > 0 ? this.data.cost / selectedUsers.length : 0;
    this.selectAllChecked = this.data.users.every(user => user.selected);
    selectedUsers.forEach(user => {
      user.owed_share = this.equalAmount;
    });
  }
  getDisplayName(user: any): string {
    return (user.first_name || '') + ' ' + (user.last_name || '') || user.email;
  }
}
