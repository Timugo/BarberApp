import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  readonly URL_API = 'http://167.172.216.181:3000';

  constructor( private http: HttpClient) { }

  postBarber(telefono: number){
    return this.http.post(this.URL_API + '/loginBarber', {phone: telefono}, httpOptions);
  }

}
