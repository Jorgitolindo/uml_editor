import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  onSubmit() {
    console.log('onSubmit', this.username, this.password);
    this.authenticationService.login(this.username, this.password)
      .subscribe(data => {
        this.router.navigate(['/']);
      });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
