import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

const URL = environment.url;
@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  

  constructor(private http: HttpClient) { }

  getAvailableOrders(city: string) {
    return this.http.get(URL + '/getAvailableOrdersByCity' + '?city=' + city);
  }

  
  assingBarberToOrder(idOrder: number, idBarber: number){
    console.log('orden', idOrder, 'barbero', idBarber);
    var order = idOrder.toString();
    var barber = idBarber.toString(); 
    console.log(URL);
    return this.http.put(URL + '/assignBarberToOrder', {idOrder: order, idBarber: barber}, httpOptions);
  }

}