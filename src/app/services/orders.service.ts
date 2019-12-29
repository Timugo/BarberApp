import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  // readonly URL_API = 'http://167.172.216.181:3000';
  readonly URL_API = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getAvailableOrders(city: string) {
    return this.http.get(this.URL_API + '/getAvailableOrdersByCity' + '?city=' + city);
  }

}
