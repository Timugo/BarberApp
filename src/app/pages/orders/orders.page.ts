import { Barber } from './../../interfaces/barber';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DataLocalService } from '../../services/data-local.service';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { OrdersService } from '../../services/orders.service';
import { AlertController, IonList } from '@ionic/angular';

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
  
  // ordenes: any[] = [
  //   {
  //     nombre: 'Andres achury',
  //     direccion: 'carrera 74A #11A - 40',
  //     servicio: 'Corte de cabello',
  //     celular: 3146727146,
  //     precio: 15000
  //   },
  //   {
  //     nombre: 'Anderson laverde',
  //     direccion: 'carrera 118 # 34 - 50',
  //     servicio: 'Corte de cabello',
  //     celular: 3186727146,
  //     precio: 15000
  //   },
  //   {
  //     nombre: 'Stiven santacruz',
  //     direccion: 'carrera 30 #1 - 40',
  //     servicio: 'Corte de cabello/barba',
  //     celular: 3116727146,
  //     precio: 18000
  //   },
  //   {
  //     nombre: 'David achury',
  //     direccion: 'carrera 74A #11A - 40',
  //     servicio: 'Corte de cabello',
  //     celular: 3166727146,
  //     precio: 15000
  //   }
  // ];

  barbero: Barber;
  titulo: string;



  constructor( private datalocalService: DataLocalService,
               private router: Router,
               private ordersService: OrdersService,
               public alertController: AlertController,
               private route: ActivatedRoute
              ) {

    // console.log('re barbero', this.datalocalService.barbero);
    this.titulo = 'Ordenes' + ' ' + this.datalocalService.barbero.city ;
    this.route.queryParams.subscribe(params => {
      if(params){
        this.city = params.city;
      }
    });

  }

  ngOnInit() {
    this.ordersService.getAvailableOrders(this.city).subscribe( res => {
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
      // subHeader: 'Subtitle',
      message: mensaje,
      // buttons: ['OK']
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
            this.datalocalService.guardarInfoCurrentOrder(codigoOrden);
            this.ordersService.assingBarberToOrder(codigoOrden,this.datalocalService.barbero.idBarber).subscribe( res => {
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
    this.presentAlertConfirm('Timugo confirmacion','¿Desea tomar la orden?',codigoOrden);
  }

  doRefresh(event) {
    console.log('Begin async operation');

    this.ordersService.getAvailableOrders(this.datalocalService.barbero.city).subscribe( res => {
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