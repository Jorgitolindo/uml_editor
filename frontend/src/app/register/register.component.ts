import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  username = '';
  fullName = '';
  password = '';
  error = '';

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  onSubmit() {
    this.authService.register(this.username, this.password, this.fullName).subscribe({
      next: () => {
        alert('✅ Registro exitoso, ahora puedes iniciar sesión.');
        this.router.navigate(['/login']);
      },
      error: err => {
        this.error = 'Error al registrar: ' + (err.error?.message || err.message || 'Desconocido');
      }
    });
  }
}
