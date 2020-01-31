import { Component, OnInit } from '@angular/core';
import { CurrentOrderService } from 'src/app/services/current-order.service';
import { DataLocalService } from 'src/app/services/data-local.service';
import { CurrentOrder } from 'src/app/interfaces/current-order';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
@Component({
  selector: 'app-current-order',
  templateUrl: './current-order.page.html',
  styleUrls: ['./current-order.page.scss'],
})
export class CurrentOrderPage implements OnInit {

  mensaje: any;
  mensaje2: any;
  currentOrder: CurrentOrder = {
    nameClient: 'Timugo',
    address: 'Timugo Address',
    phoneClient: 1111111111,
    price: 15000
  }
  formfinishOrder: FormGroup;
  servicios: any[];

  constructor(private currentorderService: CurrentOrderService,
              private datalocalService: DataLocalService,
              private fb: FormBuilder,
              public alertController: AlertController,
              private router: Router
              ) { }

  ngOnInit() {
    console.log('currentOrder:',this.datalocalService.codigo);
    this.formfinishOrder = this.fb.group({
      comment: ['']
    });
    this.currentorderService.getInfoCurrentOrder(this.datalocalService.codigo).subscribe(res => {
      this.mensaje = res;
      this.servicios = this.mensaje.content.order.services;
      console.log("orden actual",res);
      this.currentOrder = {
        nameClient: this.mensaje.content.order.nameClient,
        address: this.mensaje.content.order.address,
        phoneClient: this.mensaje.content.order.phoneClient,
        price: this.mensaje.content.order.price, 
      };
      console.log('orden actual',this.currentOrder);
    });
  }

  async Alert(titulo: string, mensaje: string, accion: number) {
    const alert = await this.alertController.create({
      header: titulo,
      // subHeader: 'Subtitle',
      message: mensaje,
      // buttons: ['OK']
      buttons: [
        {
          text: 'OK',
          handler: ( ) => {
            if (accion == 1) {
              this.router.navigate(['/orders']);
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async presentAlertPrompt(titulo: string, mensaje: string, idOrder: number, nameBarber: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      // inputs: [
      //   {
      //     name: 'cancelComment',
      //     type: 'text',
      //     placeholder: ''
      //   }
      // ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: () => {
          // handler: (data) => {
            // var comment = data.cancelComment;
            // var status = false;
            console.log(idOrder);
            console.log(this.datalocalService.barbero.idBarber);
            this.currentorderService.cancelOrder(idOrder,this.datalocalService.barbero.idBarber).subscribe(res => {
              this.mensaje2 = res;
              if ( this.mensaje2.response === 2) {
                this.Alert('Timugo informa','Su orden se cancelo con exito',1);  
              }else if (this.mensaje2.response === 1){
                this.Alert('Timugo informa','La orden no se pudo cancelar porque el cliente no recibió notificación. Por favor contactar a soporte para cancelarla',2);
              }
            });
            // this.currentorderService.finishOrder(idOrder, nameBarber, comment, status).subscribe( res => {
            //   this.mensaje2 = res;
            //   console.log(res);
            //   if ( this.mensaje2.response === 2 ) {
            //     this.Alert('Timugo informa','Su orden se cancelo con exito',1);
            //   } 
            //   console.log(res);
            // });            
          }
        }
      ]
    });

    await alert.present();
  }

  cancelOrfinish(option: number) {
    var idOrder = this.datalocalService.codigo;
    var nameBarber = this.datalocalService.barbero.name + ' ' + this.datalocalService.barbero.lastName;

    if(option == 1) {
      var comment = this.formfinishOrder.value.comment;
      var status = true;
      this.currentorderService.finishOrder(idOrder, nameBarber, comment, status).subscribe( res => {
        this.mensaje2 = res;
        if ( this.mensaje2.response === 2 ) {
          this.Alert('Timugo informa','Su orden finalizo con exito',1);
        } 
        console.log(res);
      });
    } else {
      this.presentAlertPrompt('Timugo Alerta','¿Desea cancelar su orden?',idOrder,nameBarber);
    }
  }

}
