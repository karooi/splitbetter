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
import { User, Group } from '../models/splitwise.model';

// export interface User {
//   id: number;
//   first_name: string;
//   owed_share: number;
//   selected: Boolean;
// }

export interface DialogData {
  creation_method: 'unequal' | 'equal';
  users: User[];
  data: number;
}
@Component({
  selector: 'app-add-expense',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './add-expense.component.html',
  styleUrl: './add-expense.component.scss',
})
export class AddExpenseComponent {
  selectedGroup?: Group;
  description = '';
  amount: number | null = null;
  selectedPayer = 'you';
  selectedSplit = 'equally';
  users?: User[] = [];

  constructor(private dialog: MatDialog) {}
  ngOnInit(): void {
    this.amount = 100;
    this.openSplitDialog();
  }

  openGroupDialog() {
    const dialogRef = this.dialog.open(GroupSelectionDialog);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.selectedGroup = result;
        this.users = this.selectedGroup?.members;
      }
    });
  }

  openPayerDialog() {
    const dialogRef = this.dialog.open(PayerSelectionDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.selectedPayer = result;
    });
  }

  openSplitDialog(): void {
    console.log(this.amount);
    const dialogRef = this.dialog.open(SplitSelectionDialog, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      width: '100%',
      height: '100%',
      data: {
        creation_method: 'unequal',
        users: this.users,
        cost: this.amount,
      },
    });

    dialogRef.afterClosed().subscribe((result: DialogData) => {
      if (result) {
        this.users = result.users;
        console.log('Updated users:', this.users);
        console.log('Creation method:', result.creation_method);
      }
    });
  }
}
