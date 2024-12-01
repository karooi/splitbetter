import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AddExpenseComponent } from './add-expense/add-expense.component';
import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AddExpenseComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'splitbetter';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.initApiKey();
  }
}
