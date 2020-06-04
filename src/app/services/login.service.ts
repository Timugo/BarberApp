/* Angular Dependencies */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AlertController, NavController } from '@ionic/angular';
/* Enviroment object */
import { environment } from 'src/environments/environment';
/* Interfaces */
import { Barber, DeviceInfo, BarberResponse } from '../interfaces/barber';
/* Capacitor Plugins */
import { Plugins } from '@capacitor/core';
/* Services */
import { UiServiceService } from './ui-service.service';
import { GenericResponse, LoginResponse } from '../interfaces/serverResponse';
/* Declaration of used plugins */
const { Storage,Device } = Plugins;
/* Headers of https request */
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};
/* Global API URL */
const URL = environment.url;
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  mensaje: any;
  token :string = null;
  barber: BarberResponse;
  device : DeviceInfo;

  constructor( 
    private http: HttpClient,
    public alertController: AlertController,
    private navCtrl: NavController,
    private uiService :UiServiceService,
  ) { }

  /*
    This function check if the barber credentials are ok
    case 1 : the barber is in current order, then redirecto to current order page
    case 2 : the barber isnt in current order, then redirect to orders page
  */
  async login(telefono: number) {
    this.http.post<LoginResponse>(URL + '/loginBarber', {phone: telefono}, httpOptions)
      .subscribe( res => {
        console.log(res);
        /* Login Failed */
        if (res.response === 1) {
          /* Display Allert */
          this.uiService.Alert("Login","Ups, no encontramos ese celular",1);
          /* Clean the current phone token */
          this.token = null;
          /* Clean the local storage */
          this.clear();
          /* Login success */
        } else if (res.response===2) {
            /* 
              After success login need to check is the barber
              id in a current order to redirect him to 
              current order page
            */
            this.validateIfExistsOrder(res.content.barber.phone)
              .subscribe(response=>{
                /* If the barber isnt in a current order */
                let pageToNavigate = "";
                if(response.response === 1){
                  pageToNavigate = "orders"
                  /*If the barber is in a current order */
                } else if (response.response ===2){
                  pageToNavigate = "current-order"
                }
                //save the token in the local variable
                this.token = res.content.barber.phone.toString();
                // save barber and all properties in the interface
                this.barber = res.content.barber
                /* save the information of the barber Async function */
                this.saveInfoBarber(this.barber);
                /* Save the Device info in the local storage */
                this.saveDeviceInfo(); 
                /* Redirect to Home page */
                this.navCtrl.navigateRoot(`/${pageToNavigate}`,{animated:true});     
              },err=>{
                console.log(err);
                this.uiService.Alert("Login","Ups, estamos teniendo fallas tecnicas, intenta mas tarde.",1);
              });
        }       
      });
  }

  validateIfExistsOrder(phoneBarber : string){
    return this.http.get<GenericResponse>(URL + '/checkBarberOrder' + '?phoneBarber=' + phoneBarber);
  }
  getBarberInfo(phone : string){
    return this.http.get(URL + "/getBarberByPhone?phoneBarber="+phone);
  }
  
  /* Storage Management */
  async saveInfoBarber(barber: BarberResponse){
    /* FIlter only neccesary data */
    let barbero : Barber = {
      idBarber : barber.id,
      phone : barber.phone,
      city : barber.city,
      lastName : barber.lastName,
      name : barber.name,
      balance : 0,
    }
    /* Save the barber in local storage */
    await Storage.set({
      key: 'barber',
      value:JSON.stringify(barbero)
    });
  }
  //clean local storage
  async clear() {
    await Storage.clear();
  }
  async saveDeviceInfo(){
    var device = await Device.getInfo();
    device['phone']=this.barber.phone;
    this.http.put<GenericResponse>(URL + '/saveBarberDeviceInfo', device, httpOptions).subscribe((res)=>{
    });
  }
   

}
