import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
//to handle production and development mode 
import { environment} from '../../environments/environment';
/* Interfaces */
import { GetCurrentOrderResponse } from '../interfaces/serverResponse';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};
const URL_API = environment.url;
@Injectable({
  providedIn: 'root'
})
export class CurrentOrderService {

  

  constructor(private http: HttpClient) { }

  getInfoCurrentOrder(currentOrder: number){
    return this.http.get<GetCurrentOrderResponse>(URL_API + '/getInfoTemporalOrder' + '?idOrder=' + currentOrder);
  }
  
  validateIfExistsOrder(phoneBarber : number){
     return this.http.get(URL_API + '/checkBarberOrder' + '?phoneBarber=' + phoneBarber);
  }

  finishOrder(idOrder: number, comment: string, status: string) {
    var id = idOrder.toString();
    return this.http.post(URL_API + '/finishOrder', {idOrder: id, comment: comment, status: status } ,httpOptions);
  }

  cancelOrder(idOrder: number, idUser: number) {
    var id = idOrder.toString();
    console.log("aqui",idOrder,idUser);
    return this.http.put(URL_API + '/cancelOrderBarber', {idOrder: id, idUser: idUser }, httpOptions );
  }
  
}
