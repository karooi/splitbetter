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
import { SplitwiseService } from '../splitwise.service';
import { DatePickerDialogComponent } from '../date-picker-dialog/date-picker-dialog.component';

export interface DialogData {
  selectedSplit: any[];
  creation_method: string;
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
  currentUser?: User;
  description = '';
  amount: number | null = null;
  payerMapping: Map<number, number> = new Map();
  selectedPayers: User[] = [];
  users: User[] = [];
  selectedDate: Date | null = null;
  selectedSplit: any[] = [];
  creation_method: string = 'equally';
  constructor(
    private dialog: MatDialog,
    private splitwiseService: SplitwiseService
  ) {}
  ngOnInit(): void {
    this.amount = 100;
    this.splitwiseService.getCurrentUser().subscribe((data) => {
      this.currentUser = data.user;
      this.openSplitDialog();
    });
  }

  openGroupDialog() {
    const dialogRef = this.dialog.open(GroupSelectionDialog);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.selectedGroup = result;
        this.users = this.selectedGroup?.members || [];
        this.selectedSplit = [];
      }
    });
  }

  openPayerDialog() {
    const dialogRef = this.dialog.open(PayerSelectionDialogComponent, {
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw', // Ensures the dialog doesn't exceed the screen width
      panelClass: 'full-screen-dialog', // Optional for additional styling
      data: {
        users: this.users,
        cost: this.amount,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.payerMapping = result;
        this.selectedPayers = this.users.filter((user) =>
          this.payerMapping.has(user.id)
        );
      }
    });
  }

  openSplitDialog(): void {
    this.users =
      this.users.length === 0
        ? this.currentUser
          ? [this.currentUser]
          : []
        : this.users;
    const dialogRef = this.dialog.open(SplitSelectionDialog, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      width: '100%',
      height: '100%',
      data: {
        selectedSplit: this.selectedSplit,
        creation_method: this.creation_method,
        users: this.users,
        cost: this.amount,
      },
    });

    dialogRef.afterClosed().subscribe((result: DialogData) => {
      if (result) {
        this.users = result.users;
        this.selectedSplit = result.selectedSplit;
        this.creation_method = result.creation_method;
      }
    });
  }

  openDatePicker() {
    const dialogRef = this.dialog.open(DatePickerDialogComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      width: '100%',
      height: '100%',
      data: { date: this.selectedDate },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.selectedDate = result;
      }
    });
  }

  getSelectedPayers(): string {
    return this.selectedPayers.length > 0
      ? this.selectedPayers.map((payer) => payer.first_name).join(',')
      : 'you';
  }
}
