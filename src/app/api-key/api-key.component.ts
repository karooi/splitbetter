import { Component, Inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../api.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GroupSelectionDialog } from '../group-selection-dialog/group-selection-dialog.component';

@Component({
  selector: 'app-api-key',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './api-key.component.html',
  styleUrl: './api-key.component.scss',
})
export class ApiKeyComponent {
  myControl = new FormControl('');
  apiKey: string = '';

  constructor(
    private apiService: ApiService,
    public dialogRef: MatDialogRef<GroupSelectionDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.apiKey = this.apiService.getApiKey();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onOk(): void {
    this.apiService.setApiKey(this.apiKey);
    this.dialogRef.close();
  }
}
