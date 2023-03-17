import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private fireAuth: AngularFireAuth) { }

  registerUser(user: User) {
    return this.fireAuth.createUserWithEmailAndPassword(user.email, user.password);
  }

  login(email: string, password: string) {
    return this.fireAuth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    return this.fireAuth.signOut();
  }

  getUser() {
    return this.fireAuth.authState;
  }
}
