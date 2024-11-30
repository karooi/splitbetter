import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SplitwiseService {
  private apiUrl = '/api/';

  constructor(private apiService: ApiService) {}
  getCurrencies(): Observable<any> {
    return this.apiService.get(
      `${this.apiUrl}get_currencies`,
      this.apiService.getHeaders()
    );
  }

  getCurrentUser(): Observable<any> {
    return this.apiService.get(
      `${this.apiUrl}get_current_user`,
      this.apiService.getHeaders()
    );
  }

  getGroups(): Observable<any> {
    return this.apiService.get(
      `${this.apiUrl}get_groups`,
      this.apiService.getHeaders()
    );
  }

  getExpenses(groupId: number, limit: number = 20): Observable<any> {
    const params = new URLSearchParams({
      group_id: groupId.toString(),
      limit: limit.toString(),
    });
    return this.apiService.get(
      `${this.apiUrl}get_expenses?${params.toString()}`,
      this.apiService.getHeaders()
    );
  }

  createExpense(
    cost: number,
    description: string,
    groupId: number,
    users: Array<{ user_id: number; paid_share: number; owed_share: number }>
  ): Observable<any> {
    const expenseData = {
      cost: cost.toFixed(2),
      description,
      group_id: groupId,
      users,
    };
    return this.apiService.post(
      `${this.apiUrl}create_expense`,
      expenseData,
      this.apiService.getHeaders()
    );
  }

  updateExpense(
    expenseId: number,
    cost: number,
    description: string,
    groupId: number,
    users: Array<{ user_id: number; paid_share: number; owed_share: number }>
  ): Observable<any> {
    const expenseData = {
      id: expenseId,
      cost: cost.toFixed(2),
      description,
      group_id: groupId,
      users,
    };
    return this.apiService.put(
      `${this.apiUrl}update_expense/${expenseId}`,
      expenseData,
      this.apiService.getHeaders()
    );
  }

  deleteExpense(expenseId: number): Observable<any> {
    return this.apiService.delete(
      `${this.apiUrl}delete_expense/${expenseId}`,
      this.apiService.getHeaders()
    );
  }

  getFriends(): Observable<any> {
    return this.apiService.get(
      `${this.apiUrl}get_friends`,
      this.apiService.getHeaders()
    );
  }

  createFriend(friendEmail: string): Observable<any> {
    const friendData = { email: friendEmail };
    return this.apiService.post(
      `${this.apiUrl}create_friend`,
      friendData,
      this.apiService.getHeaders()
    );
  }

  getNotifications(): Observable<any> {
    return this.apiService.get(
      `${this.apiUrl}get_notifications`,
      this.apiService.getHeaders()
    );
  }

  getGroupDetails(groupId: number): Observable<any> {
    return this.apiService.get(
      `${this.apiUrl}get_group/${groupId}`,
      this.apiService.getHeaders()
    );
  }

  getUserById(userId: number): Observable<any> {
    return this.apiService.get(
      `${this.apiUrl}get_user/${userId}`,
      this.apiService.getHeaders()
    );
  }

  addComment(expenseId: number, content: string): Observable<any> {
    const commentData = { content };
    return this.apiService.post(
      `${this.apiUrl}add_comment/${expenseId}`,
      commentData,
      this.apiService.getHeaders()
    );
  }

  getComments(expenseId: number): Observable<any> {
    return this.apiService.get(
      `${this.apiUrl}get_comments/${expenseId}`,
      this.apiService.getHeaders()
    );
  }
}
