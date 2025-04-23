import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../auth.service';
import { User } from '../user';
import { UserService } from '../user.service';
import { RouterModule } from '@angular/router';
import { ToolbarComponent } from "../toolbar/toolbar.component";

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule, ToolbarComponent],
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

  createDiagram() {
    this.userService.createDiagram(this.currentUser!!.username!!).subscribe((diagram) => {
      this.userDiagrams.push(diagram);
    });
  }

  deleteDiagram(id: string) {
    this.userService.deleteDiagram(id).subscribe(() => {
      this.userDiagrams = this.userDiagrams.filter(diagram => diagram.id !== id);
    });
  }



}
