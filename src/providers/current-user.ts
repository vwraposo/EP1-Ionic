import { User } from '../models/user'
import { Injectable } from '@angular/core';

@Injectable()
export class CurrentUser{
  user: User;


  setUser(u) {
    this.user = u;
  }

  getUser() {
    return this.user;
  }
}
