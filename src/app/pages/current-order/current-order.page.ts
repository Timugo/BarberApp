import { Component, OnInit } from '@angular/core';
import { CurrentOrderService } from 'src/app/services/current-order.service';
import { DataLocalService } from 'src/app/services/data-local.service';
import { CurrentOrder } from 'src/app/interfaces/current-order';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
    phoneClient: 1111111111,
    price: 15000,     
  }
  formfinishOrder: FormGroup;

  constructor(private currentorderService: CurrentOrderService,
              private datalocalService: DataLocalService,
              private fb: FormBuilder
              ) { }

  ngOnInit() {
    console.log('currentOrder:',this.datalocalService.codigo);
    this.formfinishOrder = this.fb.group({
      comment: ['']
    });
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

  cancelOrfinish(option: number) {

    if(option == 1) {
      var idOrder = this.datalocalService.codigo;
      var nameBarber = this.datalocalService.barbero.name + ' ' + this.datalocalService.barbero.lastName;
      var comment = this.formfinishOrder.value.comment;
      var status = true;
      this.currentorderService.finishOrder(idOrder, nameBarber, comment, status).subscribe( res => {
        console.log(res);
      });
    } else {
      console.log("opcion cancelar");
    }
  }

}
