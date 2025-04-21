import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { User, UserDiagram } from './user';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersUrl: string;

  constructor(private http: HttpClient, private authService: AuthenticationService) {
    this.usersUrl = '/api/users';
  }

  public findAll(): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl, { headers: this.authService.authHeaders() });
  }

  public findAllDiagrams(username: string): Observable<UserDiagram[]> {
    return this.http.get<UserDiagram[]>(this.usersUrl + `/${username}/diagrams`, { headers: this.authService.authHeaders() });
  }

  public createDiagram(username: string): Observable<UserDiagram> {
    return this.http.post<UserDiagram>(this.usersUrl + `/${username}/diagrams`, { headers: this.authService.authHeaders() });
  }

  public saveDiagram(id: string, diagram: any): Observable<void> {
    return this.http.post<void>(this.usersUrl + `/diagrams/${id}`, diagram, { headers: this.authService.authHeaders() });
  }

  public getDiagram(id: string): Observable<UserDiagram> {
    return this.http.get<any>(this.usersUrl + `/diagrams/${id}`, { headers: this.authService.authHeaders() });
  }
}
