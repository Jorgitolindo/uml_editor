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

  shareDiagram(id: string) {
    // 1) Construye la URL completa de edición
    const url = window.location.origin + '/editor/' + id;
    // 2) Copia al portapapeles
    navigator.clipboard.writeText(url)
      .then(() => {
        // 3) Feedback rápido
        alert('🔗 Link copiado:\n' + url);
      })
      .catch(err => {
        console.error('Error copiando link: ', err);
        alert('❌ No se pudo copiar el link');
      });
  }



}
