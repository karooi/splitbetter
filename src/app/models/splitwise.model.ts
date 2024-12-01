// User Interface
export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  registration_status: string;
  picture: Picture;
  balance: Balance[];
}

export interface Picture {
  small: string;
  medium: string;
  large: string;
}

export interface Balance {
  currency_code: string;
  amount: string;
}

// Group Interface
export interface Group {
  id: number;
  name: string;
  members: User[];
  group_type: string;
  simplify_by_default: boolean;
  updated_at: string;
}

// Expense Interface
export interface Expense {
  id: number;
  group_id: number;
  description: string;
  details: string;
  cost: string;
  currency_code: string;
  date: string;
  repeat_interval: string | null;
  updated_at: string;
  created_by: User;
  users: ExpenseUser[];
}

export interface ExpenseUser {
  user: User;
  paid_share: string;
  owed_share: string;
  net_balance: string;
}

// Friend Interface
export interface Friend {
  id: number;
  first_name: string;
  last_name: string;
  picture: Picture;
  balance: Balance[];
}

// Notification Interface
export interface Notification {
  id: number;
  type: string;
  created_at: string;
  source: NotificationSource;
}

export interface NotificationSource {
  id: number;
  type: string;
  user: User;
  group: Group;
  expense: Expense;
}

export interface Currency {
  currency_code: string;
  unit: string;
}

export interface UserExpense {
  paid_share: number;
  owed_share: number;
}
