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
export class CurrentOrderService {

  // readonly URL_API = 'http://167.172.216.181:3000';
  readonly URL_API = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getInfoCurrentOrder(currentOrder: number){
    return this.http.get(this.URL_API + '/getInfoCurrentOrder' + '?idOrder=' + currentOrder);
  }

  finishOrder(idOrder: number, nameBarber: string, comment: string, status: boolean) {
    var id = idOrder.toString();
    return this.http.post(this.URL_API + '/finishOrder', {idOrder: id, nameBarber: nameBarber, comment: comment, status: status } ,httpOptions);
  }
  
}
