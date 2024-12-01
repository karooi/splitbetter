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
import { MatSnackBar } from '@angular/material/snack-bar';

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
  selectAllChecked: boolean = false;
  multipleSelection: boolean = false;
  totalAmount: number = 0;

  constructor(
    public dialogRef: MatDialogRef<PayerSelectionDialogComponent>,
    private cdref: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.multipleSelection = this.data.multipleSelection;
    this.payerMapping = new Map(this.data.payerMapping);
    this.cdref.detectChanges();
  }

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
      this.payerMapping.set(user.id, this.data.cost / users.length);
    });
    this.cdref.detectChanges();
  }

  getDisplayName(user: any): string {
    return (user.first_name || '') + ' ' + (user.last_name || '') || user.email;
  }

  openSnackBar(message: string) {
    this.snackbar.open(message, 'OK', {
      duration: 5000,
      verticalPosition: 'top',
    });
    return;
  }

  onConfirm() {
    if (this.payerMapping.size == 0) {
      this.openSnackBar('Must choose at least one payer!');
      return;
    } else if (this.multipleSelection && this.totalAmount < this.data.cost) {
      this.openSnackBar("The total amount doesn't add up");
      return;
    }
    this.dialogRef.close({
      payerMapping: this.payerMapping,
      multipleSelection: this.multipleSelection,
    });
  }

  onBack() {
    this.dialogRef.close();
  }

  toggleSelectAll(event: any) {
    this.selectAllChecked = event.checked;
    this.updatePayers(this.selectAllChecked ? this.data.users : []);
  }

  getPayerShare(userId: number): string {
    return `${this.payerMapping.get(userId) || 0}`;
  }

  setPayerShare(user: User, value: number): void {
    const userId: number = user.id;
    const currAmount = this.payerMapping.get(userId) || 0;
    if (this.totalAmount + value - currAmount > this.data.cost) {
      const inputElement = document.getElementById(
        `input-${user.id}`
      ) as HTMLInputElement;
      this.totalAmount -= currAmount;
      this.payerMapping.set(userId, 0);
      inputElement?.blur();
      this.cdref.detectChanges();
      return;
    }
    this.totalAmount -= currAmount;
    this.totalAmount += value;
    this.payerMapping.set(userId, value);
    this.cdref.detectChanges();
  }

  toggleMultipleSelection() {
    this.multipleSelection = !this.multipleSelection;
    this.payerMapping.clear();
  }
}
