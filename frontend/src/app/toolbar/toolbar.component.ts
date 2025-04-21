import { Component } from '@angular/core';
import { AuthenticationService } from '../auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  imports: [RouterModule],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css'
})
export class ToolbarComponent {

  constructor(private authService: AuthenticationService) {}

  logout() {
    this.authService.logout();
  }

}
