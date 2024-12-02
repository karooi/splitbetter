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
import { User, Group, Currency, UserExpense } from '../models/splitwise.model';
import { SplitwiseService } from '../splitwise.service';
import { DatePickerDialogComponent } from '../date-picker-dialog/date-picker-dialog.component';
import { CurrencySelectionDialog } from '../currency-selection/currency-selection-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { getParseTreeNode } from 'typescript';
import { ApiKeyComponent } from '../api-key/api-key.component';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
import { ApiService } from '../api.service';

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
  payerMultipleSelection: boolean = false;
  selectedPayers: User[] = [];
  users: User[] = [];
  selectedDate: Date | null = null;
  selectedSplit: any[] = [];
  creation_method: string = 'equally';
  selectedCurrency: Currency = { currency_code: 'SGD', unit: 'SGD' };
  constructor(
    private dialog: MatDialog,
    private splitwiseService: SplitwiseService,
    private snackbar: MatSnackBar,
    private apiService: ApiService
  ) {}
  ngOnInit(): void {
    if (this.apiService.getApiKey().length === 0) {
      this.updateApiKey();
    }
    this.splitwiseService.getCurrentUser().subscribe((data) => {
      this.currentUser = data.user;
    });
  }

  openGroupDialog() {
    const dialogRef = this.dialog.open(GroupSelectionDialog, {
      closeOnNavigation: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.selectedGroup = result;
        this.users = this.selectedGroup?.members || [];
        //reset selected split
        this.selectedSplit = [];
        this.resetPayerSetting();
      }
    });
  }

  openCurrencyDialog() {
    const dialogRef = this.dialog.open(CurrencySelectionDialog, {
      closeOnNavigation: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.selectedCurrency = result;
      }
    });
  }

  openPayerDialog() {
    if (this.getPayerTotal() !== this.amount) {
      this.resetPayerSetting();
    }
    const dialogRef = this.dialog.open(PayerSelectionDialogComponent, {
      closeOnNavigation: false,
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw', // Ensures the dialog doesn't exceed the screen width
      panelClass: 'full-screen-dialog', // Optional for additional styling
      data: {
        users: this.users,
        cost: this.amount,
        payerMapping: this.payerMapping,
        multipleSelection: this.payerMultipleSelection,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.payerMapping = new Map(result.payerMapping);
        this.selectedPayers = this.users.filter((user) =>
          this.payerMapping.has(user.id)
        );
        this.payerMultipleSelection = result.multipleSelection;
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
      closeOnNavigation: false,
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

  updateApiKey() {
    this.dialog.open(ApiKeyComponent, {
      maxWidth: '100vw',
      width: '95%',
    });
  }

  getSelectedPayers(): string {
    return this.selectedPayers.length > 0
      ? this.selectedPayers.map((payer) => payer.first_name).join(',')
      : 'you';
  }

  openConfirmationDialog(): Promise<boolean> {
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      width: '250px',
      data: {
        header: 'Add expense',
        message: 'Would you like to add expense?',
      },
    });

    return dialogRef.afterClosed().toPromise();
  }

  async addExpense(): Promise<void> {
    //check if group is selected
    if (!this.selectedGroup) {
      this.openSnackBar('You must select a group!');
    }

    //check if description is not empty
    if (this.description.length === 0) {
      this.openSnackBar('Description cannot be empty!');
      return;
    }
    //check if the payment already added up to total
    if (!this.checkPayer()) {
      this.openSnackBar('Payment not adding up total!');
      return;
    }
    //check if the split already added up to total
    if (!this.checkSplit()) {
      this.openSnackBar('Split not adding up total!');
      return;
    }
    //if the date is empty, choose current date
    if (!this.selectedDate) {
      this.selectedDate = new Date();
    }
    const confirmed = await this.openConfirmationDialog();
    if (!confirmed) return;

    const userExpenseMap = new Map<number, UserExpense>();

    this.users.forEach((user) => {
      userExpenseMap.set(user.id, { paid_share: 0, owed_share: 0 });
    });
    this.setPaidShare(userExpenseMap);
    this.setSplitShare(userExpenseMap);

    this.splitwiseService
      .createExpense(
        this.amount ?? 0,
        this.description,
        this.selectedGroup?.id ?? 0,
        this.selectedDate?.toISOString(),
        this.selectedCurrency.currency_code,
        userExpenseMap
      )
      .subscribe((data) => {
        console.log('expense added!');
        console.log(data);
      });
  }
  setSplitShare(userExpenseMap: Map<number, UserExpense>) {
    this.amount = this.amount || 0;
    const equalAmount: number =
      this.amount / this.selectedSplit.filter((split) => split.selected).length;
    this.selectedSplit.forEach((split) => {
      const userExpense = userExpenseMap.get(split.userId);
      if (userExpense) {
        userExpense.owed_share =
          this.creation_method !== 'equally'
            ? +split.owed_share
            : split.selected
            ? equalAmount
            : 0;
      }
    });
  }
  setPaidShare(userExpenseMap: Map<number, UserExpense>) {
    const equalAmount: number = this.amount ?? 0 / this.payerMapping.size;
    this.payerMapping.forEach((paidShare, id) => {
      const userExpense = userExpenseMap.get(id);
      if (userExpense) {
        userExpense.paid_share = this.payerMultipleSelection
          ? paidShare
          : equalAmount;
      }
    });
  }

  checkSplit(): boolean {
    if (this.selectedSplit.length === 0) return false;
    if (this.creation_method !== 'equally') {
      let total = 0;
      this.selectedSplit.forEach((split) => {
        total += +split.owed_share;
      });
      if (total !== this.amount) return false;
    }
    return true;
  }

  getPayerTotal(): number {
    let total = 0;
    this.payerMapping.forEach((value) => {
      total += value;
    });
    return total;
  }

  checkPayer(): boolean {
    if (this.payerMapping.size === 0) {
      // default to current user as payee
      this.payerMapping.set(this.currentUser?.id ?? 0, this.amount ?? 0);
      return true;
    }
    //if the selection for payer is not equally method
    if (this.payerMultipleSelection) {
      if (this.getPayerTotal() !== this.amount) return false;
    }
    return true;
  }

  openSnackBar(message: string): void {
    this.snackbar.open(message, 'OK', {
      duration: 5000,
      verticalPosition: 'top',
    });
    return;
  }
  resetPayerSetting(): void {
    this.payerMapping = new Map();
    this.payerMultipleSelection = false;
  }
  onChangeInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    let value = inputElement.value;

    // Clean up preceding 0s
    value = value.replace(/^0+/, '');
    // Remove all non-numeric characters except for the decimal point.
    value = value.replace(/[^0-9.]/g, '');
    if (value.includes('.')) {
      // Split into parts before and after the decimal point.
      let [strBeforeDot, strAfterDot] = value.split('.', 2);
      // Add a zero before the decimal point if not existing.
      strBeforeDot = strBeforeDot ? strBeforeDot : '0';

      if (strAfterDot && strAfterDot.length > 2) {
        strAfterDot = strAfterDot.substring(0, 2);
      }
      strAfterDot = strAfterDot ? strAfterDot : '';
      value = strBeforeDot + '.' + strAfterDot;
    }
    inputElement.value = value;
    this.amount = parseFloat(value);
  }
}
