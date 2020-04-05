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

  getAvailableOrders(city: string,phone : number) {
    return this.http.get(URL + '/getAvailableOrdersByCity' + '?city=' + city+ '&phoneBarber=' + phone);
  }
  checkConnection(phoneBarber:number){
    return this.http.get(URL + '/checkIfBarberConnect'+'?phoneBarber=' + phoneBarber);
  }
  connectOrDisconnect(phoneBarber : number){
    return this.http.put(URL + '/connectOrDisconnectBarber', { phoneBarber: phoneBarber}, httpOptions)
  }
  assingBarberToOrder(idOrder: number, phoneBarber: number){
    console.log('orden', idOrder, 'barbero', phoneBarber);
    var order = idOrder.toString();
    var barber = phoneBarber.toString(); 
    console.log(URL);
    return this.http.put(URL + '/assignBarberToOrder', {idOrder: idOrder, phoneBarber: phoneBarber}, httpOptions);
  }

}