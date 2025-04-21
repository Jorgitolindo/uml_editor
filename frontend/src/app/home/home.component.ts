import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../auth.service';
import { User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  currentUser?: User;
  userDiagrams: any[] = [];

  constructor(
    private userService: UserService,
    private authService: AuthenticationService,
  ) {
    this.currentUser = authService.currentUserValue;
  }

  ngOnInit(): void {
    this.userService.findAllDiagrams(this.currentUser!!.username!!).subscribe((diagrams) => {
      this.userDiagrams = diagrams;
    });
  }

}
