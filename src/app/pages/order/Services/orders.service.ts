import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ResponseOrderHistory, GetCurrentOrderResponse, GenericResponse } from "src/app/interfaces/serverResponse";
import { GetOrdersRepository } from '../interfaces/responses';

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
    return this.http.get<GetOrdersRepository>(URL + '/getAvailableOrdersByCity' + '?city=' + city+ '&phoneBarber=' + phone);
  }
  getOrdersHistory(phoneBarber:number){
    return this.http.get<ResponseOrderHistory>(URL +'/getHistoryOrdersBarber'+'?phoneBarber='+phoneBarber);
  }
  getBalance(phoneBarber:number){
    return this.http.get(URL +'/getBarberBalance'+'?phoneBarber='+phoneBarber);
  }
  checkConnection(phoneBarber:number){
    return this.http.get(URL + '/checkIfBarberConnect'+'?phoneBarber=' + phoneBarber);
  }
  connectOrDisconnect(phoneBarber : number){
    return this.http.put(URL + '/connectOrDisconnectBarber', { phoneBarber: phoneBarber}, httpOptions)
  }
  assingBarberToOrder(idOrder: number, phoneBarber: number){
    return this.http.put<GenericResponse>(URL + '/assignBarberToOrder', {idOrder: idOrder, phoneBarber: phoneBarber}, httpOptions);
  }
  getInfoCurrentOrder(currentOrder: number){
    return this.http.get<GetCurrentOrderResponse>(URL + '/getInfoTemporalOrder' + '?idOrder=' + currentOrder);
  }
  validateIfExistsOrder(phoneBarber : number){
     return this.http.get<GenericResponse>(URL + '/checkBarberOrder' + '?phoneBarber=' + phoneBarber);
  }
  finishOrder(idOrder: number, status: string) {
    var id = idOrder.toString();
    return this.http.post<GenericResponse>(URL + '/finishOrCancellOrder', {idOrder: id, status: status } ,httpOptions);
  }
  cancelOrder(idOrder: number, idUser: number) {
    var id = idOrder.toString();
    console.log("aqui",idOrder,idUser);
    return this.http.put<GenericResponse>(URL + '/cancelOrderBarber', {idOrder: id, idUser: idUser }, httpOptions );
  }

}