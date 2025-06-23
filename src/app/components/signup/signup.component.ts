import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import {
  NativeScriptCommonModule,
  NativeScriptRouterModule,
  NativeScriptFormsModule,
} from '@nativescript/angular';

import { Router } from '@angular/router';
import { DatabaseService } from '../../services/database.service';
import { SignupModel } from '../../models/signup.model';

@Component({
  selector: 'SignUp',
  templateUrl: './signup.component.html',
  imports: [NativeScriptCommonModule, NativeScriptRouterModule, NativeScriptFormsModule],
  schemas: [NO_ERRORS_SCHEMA],
})
export class SignUpComponent {
  form: SignupModel =  {
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  }

  errorMessage: string = '';

  constructor(private databaseService: DatabaseService, private router: Router) {
    this.databaseService.logAllUsers();
//     this.databaseService.deleteUserById(5);
  }

  onSignup() {
    console.log("Signup form values:", this.form);
    if (this.form.password !== this.form.confirmPassword) {
      this.errorMessage = "Passwords Do Not Match!";
      return;
    }

    this.databaseService.createUser({
      username: this.form.username,
      firstName: this.form.firstName,
      lastName: this.form.lastName,
      email: this.form.email,
      password: this.form.password,
      bio: '',
      profileImage: '',
      createdAt: new Date().toISOString().replace('T', ' ')
    }).then(() => {
      this.router.navigate(['/login']);
    }).catch(err => {
      this.errorMessage = "Sign Up Failed: " + err.message;
    });
  }
}
