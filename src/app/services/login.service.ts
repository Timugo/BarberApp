import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Barber, DeviceInfo } from '../interfaces/barber';
import { NavigationExtras } from '@angular/router';
import { DataLocalService } from './data-local.service';
import { Plugins, ClipboardPluginWeb } from '@capacitor/core';
import { AlertController } from '@ionic/angular';


const { Storage,Device } = Plugins;
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};
const URL = environment.url;
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  mensaje: any;
  token :string = null;
  barber: Barber;
  device : DeviceInfo;

  constructor( private http: HttpClient,private datalocalService: DataLocalService,public alertController: AlertController,) { }

  
  login(telefono: number) {

    return new Promise(resolve=>{
      this.http.post(URL + '/loginBarber', {phone: telefono}, httpOptions).subscribe( res => {
        console.log(res);
        if (res['response'] === 1) {
          //failed login
          this.token = null; //clean  the token
          this.clear();//clean the storage
          resolve(false);
        } else{
            if(res['response']===2){
              //if the barber doesnt have a order in progress, then we need to redirect to order pages to take an order
              this.token = res['content']['barber']['phone'];
              this.barber = {
                idBarber: res['content']['barber']['id'],
                name: res['content']['barber']['name'],
                lastName: res['content']['barber']['lastName'],
                city: res['content']['barber']['city'],
                phone: res['content']['barber']['phone']
              };
              console.log('Barber From Server',this.barber);
              this.saveInfoBarber(this.barber);//save the information of the barber Async function
              this.saveDeviceInfo();
              resolve(true); //promise handling
            }
          }
      });
    });
    
  }
  getBarberInfo(phone : string){
    return this.http.get("https://timugo.tk/getBarberByPhone?phoneBarber="+phone);
  }
  
  /* Storage Management */
  async saveInfoBarber(barbero: Barber){
    await Storage.set({
      key: 'barber',
      value:JSON.stringify(barbero)
    });
  }
  async clear() {
    await Storage.clear();
  }

  async saveDeviceInfo(){
    var device = await Device.getInfo();
    device['phone']=this.barber.phone;
    console.log(device);
    this.http.put(URL + '/saveBarberDeviceInfo', device, httpOptions).subscribe((res)=>{
      console.log("respuesta al guardar la info del telefono",res);
    });
  }
   

}
