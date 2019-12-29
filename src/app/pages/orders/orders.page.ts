import { Barber } from './../../interfaces/barber';
import { Component, OnInit } from '@angular/core';
import { DataLocalService } from '../../services/data-local.service';
import { Router } from '@angular/router';
import { OrdersService } from '../../services/orders.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {

  ordenes: any[];
  mensaje: any;

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
               private ordersService: OrdersService
              ) {

    // console.log('re barbero', this.datalocalService.barbero);
    this.titulo = 'Ordenes' + ' ' + this.datalocalService.barbero.city ;

  }

  ngOnInit() {
    this.ordersService.getAvailableOrders(this.datalocalService.barbero.city).subscribe( res => {
      this.mensaje = res;
      this.ordenes = this.mensaje.content;
      console.log(res);
    });
  }

  tomarOrden(){
    this.router.navigate(['/current-order']);
  }
}
