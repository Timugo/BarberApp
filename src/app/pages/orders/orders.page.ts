import { Barber } from './../../interfaces/barber';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DataLocalService } from '../../services/data-local.service';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { OrdersService } from '../../services/orders.service';
import { AlertController, IonList, NavController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import { async } from '@angular/core/testing';

const { Storage } = Plugins;
@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {
  
  @ViewChild('lista', {static: false}) lista: IonList;
  
  ordenes: any[];
  flagOrdenes: boolean;
  flagNoOrdenes: boolean;
  mensaje: any;
  mensaje2: any;
  city: string;
  barber: Barber;
  titulo: string;



  constructor( private datalocalService: DataLocalService,
               private router: Router,
               private ordersService: OrdersService,
               public alertController: AlertController,
               private route: ActivatedRoute,
               private navCtrl: NavController,
              ) {

    //console.log('re barbero', this.datalocalService.barbero);
    //this.getBarber();//get barber info
    
  }
  
  ngOnInit() {
    this.checkExistsOrderInProgress();
    this.getBarber2(); 
  }
  async getCity() {
    const { value } = await Storage.get({ key: 'city' });
    this.city = value;
    console.log('Got item: ', value);
  }
  async getBarber2() {
    const ret = await Storage.get({ key: 'barber' });
    const user = JSON.parse(ret.value);
    this.getOrders(user);
  }
  async checkExistsOrderInProgress(){
    const { value } = await Storage.get({ key: 'currentOrder' });
    if(value){
      this.navCtrl.navigateRoot('/current-order',{animated:true});

    }
  }
  getOrders(barber:Barber){
    this.barber = barber;
    this.titulo = 'Hola' + ' ' + barber.name;
    this.ordersService.getAvailableOrders(barber.city).subscribe( res => {
      this.mensaje = res;
      console.log('ordenes',this.mensaje);
      if(this.mensaje.response === 1) {
        this.flagOrdenes = false;
        this.flagNoOrdenes = true;
        console.log('response',this.mensaje.response);
      } else if ( this.mensaje.response === 2 ) {
        console.log('response',this.mensaje.response);
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
              this.mensaje2 = res;
              if (this.mensaje2.response === 2 ) {
                this.router.navigate(['/current-order']);
                this.lista.closeSlidingItems();
              } else if (this.mensaje2.response === 1) {
                this.Alert('Timugo informa','La orden no se encontro o fue tomada por otro barbero. Por favor desliza la pantalla hacia abajo para recargar.') 
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
      this.mensaje = res;
      if(this.mensaje.response === 1) {
        this.flagOrdenes = false;
        this.flagNoOrdenes = true;
      } else if ( this.mensaje.response === 2 ) {
        this.ordenes = this.mensaje.content;
        this.flagOrdenes = true;
        this.flagNoOrdenes = false;
      }
      event.target.complete();
    });
  }
}