import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AddExpenseComponent } from './add-expense/add-expense.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AddExpenseComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'splitbetter';
}
