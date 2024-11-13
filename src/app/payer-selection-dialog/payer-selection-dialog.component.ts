import { CommonModule } from '@angular/common';
import { Component, Inject, ChangeDetectorRef } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule, MatListOption } from '@angular/material/list';
import { User } from '../models/splitwise.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-payer-selection-dialog',
  templateUrl: './payer-selection-dialog.component.html',
  styleUrl: './payer-selection-dialog.component.scss',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatListModule,
    MatCheckbox,
    CommonModule,
    FormsModule,
    MatButtonModule,
  ],
})
export class PayerSelectionDialogComponent {
  payerMapping: Map<number, number> = new Map();
  selectAllChecked = false;
  multipleSelection = false;
  totalAmount = 0;

  constructor(
    public dialogRef: MatDialogRef<PayerSelectionDialogComponent>,
    private cdref: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  updatePayersOption(options: MatListOption[]) {
    this.updatePayers(
      options.map((option) => {
        return option.value;
      })
    );
  }

  updatePayers(users: User[]) {
    this.payerMapping.clear();
    users.forEach((user) => {
      this.payerMapping.set(user.id, this.data.amount / users.length);
    });
    this.cdref.detectChanges();
  }

  getDisplayName(user: any): string {
    return (user.first_name || '') + ' ' + (user.last_name || '') || user.email;
  }

  onConfirm() {
    this.dialogRef.close(this.payerMapping);
  }

  onBack() {
    this.dialogRef.close();
  }

  toggleSelectAll(event: any) {
    this.selectAllChecked = event.checked;
    this.updatePayers(this.selectAllChecked ? this.data.users : []);
  }

  getPayerShare(userId: number): number {
    return this.payerMapping.get(userId) || 0;
  }

  setPayerShare(user: User, value: number): void {
    const userId: number = user.id;
    this.totalAmount -= this.payerMapping.get(userId) || 0;
    this.totalAmount += value;
    this.payerMapping.set(userId, value);
  }

  toggleMultipleSelection() {
    this.multipleSelection = !this.multipleSelection;
  }
}
