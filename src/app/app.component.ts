import { Component } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { CurrentOrderService } from './services/current-order.service';
import { Plugins,PushNotification,PushNotificationToken,PushNotificationActionPerformed } from '@capacitor/core';
import { Platform } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { Barber } from './interfaces/barber';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';


const { SplashScreen,PushNotifications,Storage  } = Plugins
//this url change depends which enviroment (development or production)
const  URL_API = environment.url;
//import the socket io configuration 
const config: SocketIoConfig = { url: URL_API+':8988', options: {} };
//https options to send in the headers of the requests
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  barber: Barber; //The current barber un the session -import a interface
  constructor(
              private navCtrl : NavController,
              private currentorderService: CurrentOrderService,
              private toastCtrl : ToastController,
              public platform: Platform,
              private http: HttpClient,
  ) {
    
    this.initializeApp();
  }
  //main App that start the app
  initializeApp() {
    //to check if the barber is in a current order
    this.checkIfCurrentOrder();
    //Try to register the device in all platforms except mobile web in the browser
    if(!this.platform.is("mobileweb")){
      // Register with Apple / Google to receive push via APNS/FCM
      PushNotifications.register();

      // On succcess, we should be able to receive notifications
      PushNotifications.addListener('registration',
        (token: PushNotificationToken) => {
          console.log('======= FCM TOKEN =========');
          this.savePhoneToken(token.value);
        }
      );
      // Some issue with our setup and push will not work
      PushNotifications.addListener('registrationError',
        (error: any) => {
          alert('Error on registration: ' + JSON.stringify(error));
        }
      );

      // Show us the notification payload if the app is open on our device
      PushNotifications.addListener('pushNotificationReceived',
        (notification: PushNotification) => {
          //alert('Push received: ' + JSON.stringify(notification));
          //this.startTrack("../../../assets/sounds/alert.mp3");
          this.message(notification.body);
        }
      );
      // Method called when tapping on a notification
      PushNotifications.addListener('pushNotificationActionPerformed',
        (notification: PushNotificationActionPerformed) => {
          //alert('Push action performed: ' + JSON.stringify(notification));
        }
      );
    }
    /************************************************ */
    //handdling the splashcreen time and hide
    SplashScreen.show({
      showDuration: 500,
      autoHide: true
    });
  }	 
  //get the barber from local storage 
  async checkIfCurrentOrder() {
    const ret = await Storage.get({ key: 'barber' });
    const user = JSON.parse(ret.value);
    //if exists a barber save in the local storage
    if(user){
      console.log("Desde el inicio mando el barbero"+ JSON.stringify(user));
      //Set the current barber interface= barber save in the device storage
      this.barber = user;
      // check if this barber is enrolled in a current order on progress
      this.currentorderService.validateIfExistsOrder(parseInt(user.phone)).subscribe(res =>{
        //if the server response with something
        if(res){
          //barber is in a current order
          if(res['response'] == 2){
            //navigate to the current order page
            this.navCtrl.navigateRoot('/current-order',{animated:true});
          }else{
            // if barber doesnt has any order in progress 
            if(res['response'] == 1){
              // then navigate to order page to search orders
              this.navCtrl.navigateRoot('/orders',{animated:true});  
            }
          }
        //if the server its down
        }else{
          this.message("Ups, hay un problema con tu conexion, revisala e intenta mas tarde");
        }
      });  
    }else{
      // if doesnt exists any registered barber then navigate to login page
      this.navCtrl.navigateRoot('/home',{animated:true});  
    } 
  }
  //save the token phone in the databasse
  async savePhoneToken(token: string) {
    const ret = await Storage.get({ key: 'barber' });
    const user = JSON.parse(ret.value);
    //if exists a barber save in the local storage
    if(user){
      this.barber = user;
    }else{
      this.message("Problema con el almacenamiento local, contacta con el administrador")
    }
    try{
      await this.http.put(URL_API + '/addPhoneTokenBarber', {phoneBarber:this.barber.phone,phoneToken:token}, httpOptions).subscribe( res => {
        console.log(res);
        if (res['response'] === 1) {
          console.log("no se pudo agregar el token");
        } else{
            if(res['response']===2){
              console.log("se agrego correctamente el token al usuario");
            }else{
              this.message("Error de Conexion");
            }
          }
      },);
      return true;
    } catch (err) {
      return false;
    }
  }
  //Display a toast message
  async message(mensaje: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 8000,
      color: 'primary',
      position: 'top'
    });
    toast.present();
  } 
}
