import { Component } from '@angular/core';
import { User } from '../models/splitwise.model';
import { ApiService } from '../api.service';
import { SplitwiseService } from '../splitwise.service';
import { Router } from '@angular/router';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
  ],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss',
})
export class WelcomeComponent {
  apiKey = '';
  currentUser?: User;

  constructor(
    private apiService: ApiService,
    private splitwiseService: SplitwiseService,
    private router: Router,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.apiKey = this.apiService.getApiKey();
  }

  onSubmit(): void {
    this.apiService.setApiKey(this.apiKey);
    this.splitwiseService.getCurrentUser().subscribe({
      next: (data) => {
        if (data?.user) {
          this.currentUser = data.user;
          const firstName = data.user.first_name ?? '';
          const lastName = data.user.last_name ?? '';
          const name = `${firstName} ${lastName}`.trim();
          this.openSnackBar('Welcome, ' + name );
          this.router.navigate(['/']);
        } else {
          this.handleInvalidData();
        }
      },
      error: (err) => {
        this.openSnackBar('Invalid API Key');
        this.handleInvalidData();
      },
    });
  }

  private handleInvalidData(): void {
    this.apiService.clearApiKey(); // Clear the API key
  }

  openSnackBar(message: string): void {
    this.snackbar.open(message, 'OK', {
      duration: 5000,
      verticalPosition: 'top',
    });
    return;
  }
}
