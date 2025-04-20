import { Injectable } from '@angular/core';
import { User } from './user';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersUrl: string;

  constructor(private http: HttpClient) {
    this.usersUrl = 'http://localhost:4200/api/users';
  }

  public findAll(): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl);
  }

  public sendDiagram(username: string, diagram: any): Observable<void> {
    return this.http.post<void>(this.usersUrl + `/${username}/diagram`, diagram);
  }

  public getDiagram(username: string): Observable<any> {
    return this.http.get<any>(this.usersUrl + `/${username}/diagram`);
  }
}
