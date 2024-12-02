import { Component, Inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SplitwiseService } from '../splitwise.service';
import { Group } from '../models/splitwise.model';

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
  providers: [SplitwiseService],
  templateUrl: './group-selection-dialog.component.html',
  styleUrls: ['./group-selection-dialog.component.scss'],
})
export class GroupSelectionDialog {
  myControl = new FormControl('');
  filteredOptions: Group[] = [];
  selectedGroup?: Group;
  groups: Group[] = [];

  constructor(
    public dialogRef: MatDialogRef<GroupSelectionDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private splitwiseService: SplitwiseService
  ) {
    this.filteredOptions = this.groups;

    this.myControl.valueChanges.subscribe((value) => {
      this.filterOptions(value || '');
    });
  }

  ngOnInit() {
    const storedGroups = localStorage.getItem('groups');
    if (storedGroups) {
      this.groups = JSON.parse(storedGroups);
      this.filteredOptions = this.groups;
    }

    this.splitwiseService.getGroups().subscribe((data) => {
      this.groups = data.groups;
      this.filteredOptions = this.groups;
      localStorage.setItem('groups', JSON.stringify(this.groups));
    });

    this.myControl.valueChanges.subscribe((value) => {
      this.filterOptions(value || '');
    });
  }

  filterOptions(searchTerm: string) {
    const filterValue = searchTerm.toLowerCase();
    this.filteredOptions = this.groups.filter((group) =>
      group.name.toLowerCase().includes(filterValue)
    );
  }

  selectOption(option: Group) {
    this.selectedGroup = option;
    this.closeDialog();
  }

  closeDialog() {
    this.dialogRef.close(this.selectedGroup);
  }
}
