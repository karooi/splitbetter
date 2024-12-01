import { Component, Inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SplitwiseService } from '../splitwise.service';
import { Currency } from '../models/splitwise.model';

@Component({
  selector: 'app-currency-selection',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
  ],
  templateUrl: './currency-selection-dialog.component.html',
  styleUrl: './currency-selection-dialog.component.scss',
})
export class CurrencySelectionDialog {
  myControl = new FormControl('');
  filteredOptions: Currency[] = [];
  selectedCurrency: Currency = { currency_code: 'SGD', unit: 'SGD' };
  currencies: Currency[] = [];
  recents: Currency[] = [];
  filteredRecents: Currency[] = [];
  constructor(
    public dialogRef: MatDialogRef<CurrencySelectionDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private splitwiseService: SplitwiseService
  ) {
    this.filteredOptions = this.currencies;

    this.myControl.valueChanges.subscribe((value) => {
      if (value) {
        this.filterOptions(value);
      }
    });
  }

  ngOnInit() {
    const currencyRecents = sessionStorage.getItem('currencyRecents');
    if (currencyRecents) {
      this.recents = JSON.parse(currencyRecents);
      this.filteredRecents = this.recents;
    }
    this.splitwiseService.getCurrencies().subscribe((data) => {
      this.currencies = data.currencies;
      this.filteredOptions = this.currencies;
    });
    this.myControl.valueChanges.subscribe((value) => {
      if (value) {
        this.filterOptions(value);
      }
    });
  }

  filterOptions(searchTerm: string) {
    const filterValue = searchTerm.toLowerCase();
    this.filteredOptions = this.currencies.filter((group) =>
      group.currency_code.toLowerCase().includes(filterValue)
    );
    this.filteredRecents = this.recents.filter((group) =>
      group.currency_code.toLowerCase().includes(filterValue)
    );
  }

  selectOption(option: Currency) {
    this.selectedCurrency = option;
    this.closeDialog();
  }

  closeDialog() {
    this.recents = this.recents.filter(
      (currency) => currency !== this.selectedCurrency
    );
    this.recents.unshift(this.selectedCurrency);
    this.recents = this.recents.slice(0, 3);
    sessionStorage.setItem('currencyRecents', JSON.stringify(this.recents));
    this.dialogRef.close(this.selectedCurrency);
  }
}
