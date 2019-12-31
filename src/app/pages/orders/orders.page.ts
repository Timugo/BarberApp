import { Barber } from './../../interfaces/barber';
import { Component, OnInit } from '@angular/core';
import { DataLocalService } from '../../services/data-local.service';
import { Router } from '@angular/router';
import { OrdersService } from '../../services/orders.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {

  ordenes: any[];
  flagOrdenes: boolean;
  flagNoOrdenes: boolean;
  mensaje: any;
  mensaje2: any;


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
               public alertController: AlertController
              ) {

    // console.log('re barbero', this.datalocalService.barbero);
    this.titulo = 'Ordenes' + ' ' + this.datalocalService.barbero.city ;

  }

  ngOnInit() {
    this.ordersService.getAvailableOrders(this.datalocalService.barbero.city).subscribe( res => {
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
          }
        }, {
          text: 'Tomar',
          handler: () => {
            this.datalocalService.guardarInfoCurrentOrder(codigoOrden);
            this.ordersService.assingBarberToOrder(codigoOrden,this.datalocalService.barbero.idBarber).subscribe( res => {
              this.mensaje2 = res;
              if (this.mensaje2.response === 2 ) {
                this.router.navigate(['/current-order']);
              } else {
                
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