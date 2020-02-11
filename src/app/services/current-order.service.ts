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

  
  readonly URL_API = 'https://www.timugo.tk';

  constructor(private http: HttpClient) { }

  getInfoCurrentOrder(currentOrder: number){
    return this.http.get(this.URL_API + '/getInfoTemporalOrder' + '?idOrder=' + currentOrder);
  }
  
  validateIfExistsOrder(idBarber : number){
    return this.http.get(this.URL_API + '/checkBarberOrder' + '?idBarber=' + idBarber);

  }

  finishOrder(idOrder: number, comment: string, status: string) {
    var id = idOrder.toString();
    return this.http.post(this.URL_API + '/finishOrder', {idOrder: id, comment: comment, status: status } ,httpOptions);
  }

  cancelOrder(idOrder: number, idUser: number) {
    var id = idOrder.toString();
    console.log("aqui",idOrder,idUser);
    return this.http.put(this.URL_API + '/cancelOrderBarber', {idOrder: id, idUser: idUser }, httpOptions );
  }
  
}
