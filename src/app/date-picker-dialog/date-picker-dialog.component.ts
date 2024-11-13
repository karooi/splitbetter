import {
  model,
  Component,
  Inject,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MatNativeDateModule,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-date-picker-dialog',
  templateUrl: './date-picker-dialog.component.html',
  styleUrls: ['./date-picker-dialog.component.scss'],
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatDialogModule, MatDatepickerModule, MatNativeDateModule, MatIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatePickerDialogComponent {
  selectedDate = model<Date | null>(null);

  constructor(
    public dialogRef: MatDialogRef<DatePickerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { date: Date }
  ) {
    this.selectedDate.set(data.date || new Date());
  }

  onConfirm() {
    this.dialogRef.close(this.selectedDate());
  }

  onBack() {
    this.dialogRef.close();
  }
}
