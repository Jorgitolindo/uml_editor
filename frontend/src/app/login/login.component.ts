import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  username = '';
  password = '';
  error = '';
  returnUrl = '/';

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute
  ) {

  }

  ngOnInit(): void {
    // Capturamos la URL a la que se quería acceder
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
     // 2) Si ya tenemos currentUser, saltamos al returnUrl inmediatamente
  if (this.authenticationService.currentUserValue) {
    this.router.navigateByUrl(this.returnUrl);
  }
  }

  onSubmit() {
    this.authenticationService.login(this.username, this.password)
      .subscribe({
        next: () => {
          // Redirige a la ruta original
          this.router.navigateByUrl(this.returnUrl);
        },
        error: err => {
          this.error = 'Usuario o contraseña inválidos';
        }
      });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
