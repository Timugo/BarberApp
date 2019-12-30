import { Component, OnInit } from '@angular/core';
import { CurrentOrderService } from 'src/app/services/current-order.service';
import { DataLocalService } from 'src/app/services/data-local.service';
import { CurrentOrder } from 'src/app/interfaces/current-order';


@Component({
  selector: 'app-current-order',
  templateUrl: './current-order.page.html',
  styleUrls: ['./current-order.page.scss'],
})
export class CurrentOrderPage implements OnInit {

  mensaje: any;
  currentOrder: CurrentOrder = {
    nameClient: 'Timugo',
    address: 'Timugo Address',
    phoneClient: 3146727146,
    price: 15000,     
  }

  constructor(private currentorderService: CurrentOrderService,
              private datalocalService: DataLocalService) { }

  ngOnInit() {
    console.log('currentOrder:',this.datalocalService.codigo);
    this.currentorderService.getInfoCurrentOrder(this.datalocalService.codigo).subscribe(res => {
      this.mensaje = res;
      this.currentOrder = {
        nameClient: this.mensaje.content.nameClient,
        address: this.mensaje.content.address,
        phoneClient: this.mensaje.content.phoneClient,
        price: this.mensaje.content.price, 
      };
      console.log('orden actual',this.currentOrder);
    });
  }

}
