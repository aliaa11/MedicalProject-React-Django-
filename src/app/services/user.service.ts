import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: any[] = []; // تخزين المستخدمين مؤقتًا

  constructor() {}

  getUsers() {
    return this.users;
  }

  addUser(user: any) {
    this.users.push(user);
  }
}
