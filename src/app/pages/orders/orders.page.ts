import { Barber, Componente } from './../../interfaces/barber';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DataLocalService } from '../../services/data-local.service';
import { Router, ActivatedRoute } from '@angular/router';
import { OrdersService } from '../../services/orders.service';
import { AlertController, IonList, NavController, ToastController, MenuController } from '@ionic/angular';
import { Plugins,PushNotification,PushNotificationToken,PushNotificationActionPerformed } from '@capacitor/core';
import { Observable } from 'rxjs';
import { UiServiceService } from 'src/app/services/ui-service.service';
import { Platform } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
//to handle production and development mode 
import { environment} from '../../../environments/environment';

const { Storage,PushNotifications } = Plugins;
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};
//this url change depends which enviroment (development or production)
const  URL_API = environment.url;
@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {
  
  @ViewChild('lista') lista: IonList;
  activeMenu :string;
  ordenes: Observable<any>;
  flagOrdenes: boolean;
  flagNoOrdenes: boolean;
  mensaje: any;
  mensaje2: any;
  city: string;
  barber: Barber;
  titulo: string;
  nameBarber:string="none"

  componentes: Observable<Componente[]>; //listo of components in the menu


  constructor( private datalocalService: DataLocalService,
               private router: Router,
               private ordersService: OrdersService,
               public alertController: AlertController,
               private navCtrl: NavController,
               private dataService : UiServiceService,
               private toastCtrl : ToastController,
               public platform: Platform,
               private menu:MenuController,
               private http: HttpClient,
              ) {
                this.activeMenu = 'first';
                this.menu.enable(true, this.activeMenu);
                this.getBarber2(); 
    
              }
  
  ngOnInit() {
    console.log(environment.message);
      
    this.componentes = this.dataService.getMenuOpts();  
    //Try to register the device in all platforms except mobile web in the browser
    if(!this.platform.is("mobileweb")){
      // Register with Apple / Google to receive push via APNS/FCM
      PushNotifications.register();

      // On succcess, we should be able to receive notifications
      PushNotifications.addListener('registration',
        (token: PushNotificationToken) => {
          console.log('======= FCM TOKEN =========');
          this.savePhoneToken(token.value,this.barber.phone);
          
          console.log(token.value,this.barber.phone);
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
          this.menssage(notification.body);
        }
      );
      // Method called when tapping on a notification
      PushNotifications.addListener('pushNotificationActionPerformed',
        (notification: PushNotificationActionPerformed) => {
          alert('Push action performed: ' + JSON.stringify(notification));
        }
      );
    }
    

    /************************************************ */
  }
  async savePhoneToken(token: string,phone:string) {
    try{
      await this.http.put(URL_API + '/addPhoneTokenBarber', {phoneBarber: phone,phoneToken:token}, httpOptions).subscribe( res => {
        console.log(res);
        if (res['response'] === 1) {
          console.log("no se pudo agregar ek token");
          //failed login
          //this.uiService.Alert("Login","Ups, no encontramos ese celular",1);
          //this.token = null; //clean  the token
          //this.clear();//clean the storage
        } else{
            if(res['response']===2){
              console.log("se agrego correctamente el token al usuario");
              //if the barber doesnt have a order in progress, then we need to redirect to order pages to take an order
              // this.token = res['content']['barber']['phone'];
              // this.barber = {
              //   idBarber: res['content']['barber']['id'],
              //   name: res['content']['barber']['name'],
              //   lastName: res['content']['barber']['lastName'],
              //   city: res['content']['barber']['city'],
              //   phone: res['content']['barber']['phone']
              // };
              // console.log('Barber From Server',this.barber);
              // this.saveInfoBarber(this.barber);//save the information of the barber Async function
              // this.saveDeviceInfo();              
              // let navigationExtras : NavigationExtras ={
              //   queryParams:{
              //     barber: JSON.stringify(this.barber)
              //   }
              // }
              // //this.navCtrl.setDirection('root');
              // //this.router.navigateByUrl('/orders',navigationExtras);
              // this.navCtrl.navigateRoot('/orders',{animated:true},);
            }
          }
      },);
      return true;
    } catch (err) {
      return false;
    }
  }
  async menssage(mensaje: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 8000,
      color: 'primary',
      position: 'top'
    });
    toast.present();
  }
  async getCity() {
    const { value } = await Storage.get({ key: 'city' });
    this.city = value;
   
  }
  async getBarber2() {
    const ret = await Storage.get({ key: 'barber' });
    const user = JSON.parse(ret.value);
    if(user){
      this.getOrders(user);
    }else{
      this.navCtrl.navigateRoot('/home',{animated:true},);
    }
  }
  async checkExistsOrderInProgress(){
    const { value } = await Storage.get({ key: 'currentOrder' });
    if(value){
      this.navCtrl.navigateRoot('/current-order',{animated:true});

    }
  }
  getOrders(barber:Barber){
    this.barber = barber;
    if(environment.message =="DEVELOPMENT MODE"){
      this.titulo = "Development Mode";
    }else{
      this.titulo = "Servicios"
    }
    this.ordersService.getAvailableOrders(barber.city).subscribe( res => {
      this.mensaje = res;
      console.log('Fetch de Ordenes',this.mensaje);
      if(this.mensaje.response === 1) {
        this.flagOrdenes = false;
        this.flagNoOrdenes = true;
      } else if ( this.mensaje.response === 2 ) {
        this.ordenes = this.mensaje.content;
        this.flagOrdenes = true;
        this.flagNoOrdenes = false;
      }
    });

  }
  async Alert(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: [
        {
          text: 'OK',
          handler: ( ) => {
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();

  }
  async presentAlertConfirm(titulo: string, mensaje: string, codigoOrden: number) {

    const alert = await this.alertController.create({
      mode:"ios",
      translucent:false,
      header: titulo,
      message: mensaje,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            this.lista.closeSlidingItems();
          }
        }, {
          text: 'Tomar',
          handler: () => {
            this.datalocalService.saveInfoCurrentOrder(codigoOrden);
            this.ordersService.assingBarberToOrder(codigoOrden,this.barber.idBarber).subscribe( res => {
              console.log(res);
              this.mensaje2 = res;
              if (this.mensaje2.response === 2 ) {
                this.router.navigate(['/current-order']);
                this.lista.closeSlidingItems();
              } else if (this.mensaje2.response === 1) {
                this.Alert('Upss','La orden no se encontro o fue tomada por otro barbero. Por favor desliza la pantalla hacia abajo para recargar.') 
              }
            });
          }
        }
      ]
    });
    await alert.present();
  }  
  tomarOrden(codigoOrden: number){
    this.presentAlertConfirm('Confirmacion la Orden','¿Deseas tomarla?',codigoOrden);
  }
  doRefresh(event) {
    this.ordersService.getAvailableOrders(this.barber.city).subscribe( res => {
      console.log("refreshing orders");
      this.mensaje = res;
      if(this.mensaje.response === 1) {
        this.flagOrdenes = false;
        this.flagNoOrdenes = true;
      } else if ( this.mensaje.response === 2 ) {
        this.ordenes = this.mensaje.content;
        this.flagOrdenes = true;
        this.flagNoOrdenes = false;
      }
      setTimeout(() => {
        event.target.complete();
      }, 3000);
    });
  }
}