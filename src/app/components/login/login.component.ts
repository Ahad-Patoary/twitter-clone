import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import {
  NativeScriptCommonModule,
  NativeScriptRouterModule,
  NativeScriptFormsModule,
} from '@nativescript/angular';
import { Router } from '@angular/router';
import { UserService } from '../../services/auth-service.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'Login',
  templateUrl: './login.component.html',
    imports: [NativeScriptCommonModule, NativeScriptRouterModule, NativeScriptFormsModule],
    schemas: [NO_ERRORS_SCHEMA],
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  currentUser: User | null = null;

  constructor(private userService: UserService, private router: Router) {}

  async onLogin(): Promise<void> {
    const success = await this.userService.login(this.username, this.password);
    if (success) {
      this.currentUser = this.userService.getCurrentUser();
      this.router.navigate(['/home']);
    } else {
      this.errorMessage = 'Invalid username or password';
    }
  }

  goToSignup() {
    this.router.navigate(['/signup']);
  }
}
