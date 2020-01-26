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
export class OrdersService {

  readonly URL_API = 'http://167.172.216.181:3000';
  //readonly URL_API = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getAvailableOrders(city: string) {
    return this.http.get(this.URL_API + '/getAvailableOrdersByCity' + '?city=' + city);
  }

  assingBarberToOrder(idOrder: number, idBarber: number){
    console.log('orden', idOrder, 'barbero', idBarber);
    var order = idOrder.toString();
    var barber = idBarber.toString(); 
    return this.http.put(this.URL_API + '/assignBarberToOrder', {idOrder: order, idBarber: barber}, httpOptions);
  }

}