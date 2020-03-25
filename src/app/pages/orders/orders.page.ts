//Interfaces to be Used to manage data
import { Barber, Componente } from './../../interfaces/barber';
import { Track } from '../../interfaces/track';
//Angular Stuff
import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonList, NavController, ToastController, MenuController } from '@ionic/angular';
//Hanlding Local data with a service
import { DataLocalService } from '../../services/data-local.service';
//manage Routes and redirections
import { Router } from '@angular/router';
//Services From server
import { OrdersService } from '../../services/orders.service';
//Capacitor plugins ALlows to use Native Android and ios SDKS 
import { Plugins } from '@capacitor/core';
//To handle Data
import { Observable } from 'rxjs';
//Display things like modlas toasts etc
import { UiServiceService } from 'src/app/services/ui-service.service';
//Platform can detect in which device is ionc running (android, ios web , tablet etc)
import { Platform } from '@ionic/angular';
//to handle production and development mode 
import { environment} from '../../../environments/environment';
//Library to Play local audios
import { Howl } from 'howler';
//socket importation
//import { Socket } from 'ngx-socket-io';
//Using 
const { Storage, LocalNotifications} = Plugins;
///local notification configuration

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {
  @ViewChild('lista') lista: IonList;
  //Array of the sounds to play with HOWL library
  playList: Track[] = [
    {
      name: 'hi',
      path : '../../../assets/sounds/alert.mp3'
    }
  ];
  player : Howl = null; // Audio Library
  activeMenu :string; //To hide the side menu
  ordenes: Observable<any>; //Array of orders (needs to import an interface)
  flagOrdenes: boolean; //if exists orders
  flagNoOrdenes: boolean; //if doesnt exists any orders
  mensaje: any;
  mensaje2: any; 
  city: string; //city of the current barber
  barber: Barber; //The current barber un the session -import a interface
  titulo: string; //tittle of the page
  nameBarber:string="none"
  componentes: Observable<Componente[]>; //listo of components in the menu
  conection : boolean ;
  


  constructor(
              // TO hanlge local data
              private datalocalService: DataLocalService,
              //TO do redirections
              private router: Router,
              // Order services to do request to server
              private ordersService: OrdersService,
              //display allerts
              public alertController: AlertController,
              //To handle Pages navigations
              private navCtrl: NavController,
              //TO ddo request to server
              private dataService : UiServiceService,
              //to display todast
              private toastCtrl : ToastController,
              //detects whichs is the current platform running
              public platform: Platform,
              //SIde menu controller
              private menu:MenuController,
               //private socket : Socket
              ) {
                //Named the current side menu
                this.activeMenu = 'first';
                //Enable side menu to handle it
                this.menu.enable(true, this.activeMenu);
                //get current barber info 
                this.getBarber2(); 
    
              }          
  ngOnInit() {
    //this.router.navigate(['/payments']);
    console.log(environment.message);
    //Charge the options to display in the side menu
    this.componentes = this.dataService.getMenuOpts();  
    
  }
  //PLay sounds
  startTrack(src : String){
    console.log("Estoy reproduciendo la musica");
    this.player = new Howl({
      src: src
    });
    this.player.play();
  }
  //Coonection of the barber to recieve new orders 
  async connectBarber(){
    //First the barber need to listen the socket so he can now recieve new orders if he is active
    //this.socket.connect();
    //If the barber recieve new order so here we are displaying local notification to anounce it
    const notifs = await LocalNotifications.schedule({
      notifications: [
        {
          title: "Timugo",
          body: "Estas Conectado para recibir Pedidos",
          id: 1,
          schedule: { at: new Date(Date.now()+ 1000 * 5) },
          sound:"../../../assets/sounds/alert.mp3",
          attachments: null,
          actionTypeId: "",
          extra: null
        }
      ]
    });
  }
  //Display a toast allert
  async message(mensaje: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 8000,
      color: 'primary',
      position: 'top'
    });
    toast.present();
  }
  //Get barber information from local storage
  async getBarber2() {
    const ret = await Storage.get({ key: 'barber' });
    const user = JSON.parse(ret.value);
    //if the barber exists in local storage
    if(user){
      //then we can search new orders
      this.getOrders(user);
    }else{
      //if not, then redirect barber to home login page
      this.navCtrl.navigateRoot('/home',{animated:true},);
    }
  }
  //function to recieve new orders and refresh
  getOrders(barber:Barber){
    this.barber = barber;
    if(environment.message =="DEVELOPMENT MODE"){
      this.titulo = "Development Mode";
    }else{
      this.titulo = "Servicios"
    }
    this.ordersService.getAvailableOrders(barber.city,parseInt(barber.phone)).subscribe( res => {
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
  //display an allert 
  async Alert(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: [
        {
          text: 'OK',
          handler: ( ) => {
            //if press OK button
            console.log('Confirm Okay');
          }
        }
      ]
    });
    //show the allert ins screen
    await alert.present();
  }
  //TO Confirme take order
  tomarOrden(codigoOrden: number){
    this.presentAlertConfirm('Confirmacion la Orden','¿Deseas tomarla?',codigoOrden);
  }
  //second step to take the order
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
            this.ordersService.assingBarberToOrder(codigoOrden,parseInt(this.barber.phone)).subscribe( res => {
              console.log(res);
              this.mensaje2 = res;
              //if the barber took the order correctly
              if (this.mensaje2.response === 2 ) {
                //then redirect to current order page to see the order info
                this.router.navigate(['/current-order']);
                //close sliding items in the list
                this.lista.closeSlidingItems();
                //if existe an error
              } else if (this.mensaje2.response === 1) {
                //display an allert
                this.Alert('Upss','La orden no se encontro o fue tomada por otro barbero. Por favor desliza la pantalla hacia abajo para recargar.') 
              }
            });
          }
        }
      ]
    });
    await alert.present();
  }  
  //PUll to refresh implementation
  doRefresh(event) {
    this.ordersService.getAvailableOrders(this.barber.city,parseInt(this.barber.phone)).subscribe( res => {
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
      //Wait to refresh (just a estetic view)
      setTimeout(() => {
        event.target.complete();
      }, 3000);
    });
  }
}