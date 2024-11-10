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

export interface User {
  id: number;
  first_name: string;
  owed_share: number;
  selected: Boolean;
}

export interface DialogData {
  creation_method: 'unequal' | 'equal';
  users: any[];
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
  selectedGroup = 'All of Sipidan';
  description = '';
  amount: number | null = null;
  selectedPayer = 'you';
  selectedSplit = 'equally';

  constructor(private dialog: MatDialog) {}
  ngOnInit(): void {
    this.amount = 100; this.openSplitDialog()}

  openGroupDialog() {
    const dialogRef = this.dialog.open(GroupSelectionDialog);
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result) {
        this.selectedGroup = result;
      }
    });
  }

  openPayerDialog() {
    const dialogRef = this.dialog.open(PayerSelectionDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.selectedPayer = result;
    });
  }
  users = [
    {
      "id": 51419209,
      "first_name": "Kurt",
      "last_name": null,
      "picture": {
          "small": "https://s3.amazonaws.com/splitwise/uploads/user/default_avatars/avatar-ruby35-50px.png",
          "medium": "https://s3.amazonaws.com/splitwise/uploads/user/default_avatars/avatar-ruby35-100px.png",
          "large": "https://s3.amazonaws.com/splitwise/uploads/user/default_avatars/avatar-ruby35-200px.png"
      },
      "email": "kurtlooi@hotmail.com",
      "owed_share": 50,
  },
  {
      "id": 96762518,
      "first_name": "ricardojack96",
      "last_name": null,
      "picture": {
          "small": "https://s3.amazonaws.com/splitwise/uploads/user/default_avatars/avatar-orange47-50px.png",
          "medium": "https://s3.amazonaws.com/splitwise/uploads/user/default_avatars/avatar-orange47-100px.png",
          "large": "https://s3.amazonaws.com/splitwise/uploads/user/default_avatars/avatar-orange47-200px.png"
      },
      "email": "ricardojack96@gmail.com",
      "owed_share": 50,
  },
  ];

  openSplitDialog(): void {
    console.log(this.amount)
    const dialogRef = this.dialog.open(SplitSelectionDialog, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      width: '100%',
      height: '100%',
      data: {
        creation_method: 'unequal',
        users: this.users,
        cost: this.amount
      }
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
