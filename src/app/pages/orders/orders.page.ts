import { Barber, Componente } from './../../interfaces/barber';
import { Track } from '../../interfaces/track';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DataLocalService } from '../../services/data-local.service';
import { Router } from '@angular/router';
import { OrdersService } from '../../services/orders.service';
import { AlertController, IonList, NavController, ToastController, MenuController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import { Observable } from 'rxjs';
import { UiServiceService } from 'src/app/services/ui-service.service';
import { Platform } from '@ionic/angular';

//to handle production and development mode 
import { environment} from '../../../environments/environment';
//play audio
import { Howl } from 'howler';
//import { Socket } from 'ngx-socket-io';

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
  


  constructor( private datalocalService: DataLocalService,
               private router: Router,
               private ordersService: OrdersService,
               public alertController: AlertController,
               private navCtrl: NavController,
               private dataService : UiServiceService,
               private toastCtrl : ToastController,
               public platform: Platform,
               private menu:MenuController,
               //private socket : Socket
              ) {
                this.activeMenu = 'first';
                this.menu.enable(true, this.activeMenu);
                //get current barber info 
                this.getBarber2(); 
    
              }
  
              
  ngOnInit() {
    //this.socket.connect();
    console.log(environment.message);
    this.componentes = this.dataService.getMenuOpts();  
    
  }
  startTrack(src : String){
    console.log("Estoy reproduciendo la musica");
    this.player = new Howl({
      src: src
    });
    this.player.play();
  }

  async connectBarber(){
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
            this.ordersService.assingBarberToOrder(codigoOrden,parseInt(this.barber.phone)).subscribe( res => {
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
      setTimeout(() => {
        event.target.complete();
      }, 3000);
    });
  }
}