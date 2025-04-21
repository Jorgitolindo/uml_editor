import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { DiagramEditorComponent } from './diagram-editor/diagram-editor.component';
import { AuthGuard } from './auth-guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'editor/:id', component: DiagramEditorComponent, canActivate: [AuthGuard] },
    { path: '', redirectTo: '/home', pathMatch: 'full' }, // Redirect empty path to home
    { path: '**', redirectTo: '/home', pathMatch: 'full' } // Redirect any unknown path to home
];
