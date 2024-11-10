import { Component, Inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-group-selection-dialog.component',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
  ],
  templateUrl: './group-selection-dialog.component.html',
  styleUrls: ['./group-selection-dialog.component.scss'],
})
export class GroupSelectionDialog {
  myControl = new FormControl('');
  filteredOptions: string[] = [];
  selectedGroup: string = '';

  // Hardcoded list of options
  options: string[] = [
    'SG',
    'Shanghai',
    'Sipidan',
    'Sze',
    'Celestine Hoong',
    'Gabriel Goh',
  ];

  constructor(
    public dialogRef: MatDialogRef<GroupSelectionDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Initialize filtered options with the full list
    this.filteredOptions = this.options;

    // Update filtered options whenever the input changes
    this.myControl.valueChanges.subscribe((value) => {
      this.filterOptions(value || '');
    });
  }

  filterOptions(searchTerm: string) {
    const filterValue = searchTerm.toLowerCase();
    this.filteredOptions = this.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  selectOption(option: string) {
    this.selectedGroup = option;
    this.closeDialog();
  }

  closeDialog() {
    this.dialogRef.close(this.selectedGroup);
  }
}
