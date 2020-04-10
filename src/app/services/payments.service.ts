import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Response } from "src/app/interfaces/serverResponse";



const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

const URL = environment.url;


@Injectable({
  providedIn: 'root'
})
export class PaymentsService {

  constructor(private http: HttpClient) { }
  
  makePushPayment(phoneNumber: string,value : string) {
    let body = {
      phoneNumber,
      value,
      references : ["recarga de saldo timugo"]
    };
    return this.http.post<Response>(URL + '/payment/nequi/pushPayment',body,httpOptions);
  }
  checkPushPayment(codeQR : string ){
  
    console.log(codeQR);
    return this.http.post<Response>(URL + '/payment/nequi/checkPushPayment',{codeQR},httpOptions);

  }
}