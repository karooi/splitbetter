import { Component } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { GroupSelectionDialog } from '../group-selection-dialog/group-selection-dialog.component'; 
import { PayerSelectionDialogComponent } from '../payer-selection-dialog/payer-selection-dialog.component'; 
import { SplitSelectionDialog } from '../split-selection-dialog/split-selection-dialog.component'; 
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-expense',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, CommonModule, FormsModule ],
  templateUrl: './add-expense.component.html',
  styleUrl: './add-expense.component.scss'
})
export class AddExpenseComponent {
  selectedGroup = 'All of Sipidan';
  description = '';
  amount: number | null = null;
  selectedPayer = 'you';
  selectedSplit = 'equally';

  constructor(private dialog: MatDialog) {}

  openGroupDialog() {
    const dialogRef = this.dialog.open(GroupSelectionDialog);
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.selectedGroup = result;
    });
  }

  openPayerDialog() {
    const dialogRef = this.dialog.open(PayerSelectionDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.selectedPayer = result;
    });
  }

  openSplitDialog() {
    const dialogRef = this.dialog.open(SplitSelectionDialog);
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.selectedSplit = result;
    });
  }
}