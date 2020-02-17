import { Component, OnInit } from '@angular/core';
import { CurrentOrderService } from 'src/app/services/current-order.service';
import { FormGroup, FormBuilder,} from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Plugins } from '@capacitor/core';
import { Barber } from 'src/app/interfaces/barber';
import { ToastController } from '@ionic/angular';

const { Storage,Clipboard } = Plugins;
@Component({
  selector: 'app-current-order',
  templateUrl: './current-order.page.html',
  styleUrls: ['./current-order.page.scss'],
})
export class CurrentOrderPage implements OnInit {

  mensaje: any;
  mensaje2: any;
  currentOrder: any;
  formfinishOrder: FormGroup;
  servicios: any[];
  barber:Barber;
  idCurrentOrder :string;

  constructor(private currentorderService: CurrentOrderService,
              private fb: FormBuilder,
              private alertController: AlertController,
              private router: Router,
              private navCtrl : NavController,
              private toastController: ToastController
              ) { }

  ngOnInit() {
    this.formfinishOrder = this.fb.group({
      comment: ['']
    });
    this.checkIfOrderExistsInLocal();
    this.checkIfOrderExistsInServer();
    this.loadCurrentOrder();
  }

  getInfoOrder(idOrder:number){
    this.idCurrentOrder = idOrder.toString();
    console.log("aca voy ",idOrder);
    

    this.currentorderService.getInfoCurrentOrder(idOrder).subscribe(res => {
      this.mensaje = res;
      this.servicios = this.mensaje.content.order.services;
      this.currentOrder = {
        nameClient: this.mensaje.content.order.nameClient,
        address: this.mensaje.content.order.address,
        phoneClient: this.mensaje.content.order.phoneClient,
        price: this.mensaje.content.order.price, 
      };
      
    });
  }
  copyToCLipboard(){
    Clipboard.write({
      string: this.currentOrder.phoneClient.toString()
    });
    this.presentToast("Numero Copiado!");
  }
  async loadCurrentOrder(){
    const { value } = await Storage.get({ key: 'currentOrder' });
    this.getInfoOrder(parseInt(value));
  }
  async checkIfOrderExistsInLocal(){
    const { value } = await Storage.get({ key: 'currentOrder' });
    if(!value){
      this.router.navigate(['/orders']);
    }
    
  }
  async checkIfOrderExistsInServer(){
    const ret = await Storage.get({ key: 'barber' });
    const user = JSON.parse(ret.value);
    if(user){
      this.currentorderService.validateIfExistsOrder(user.idBarber).subscribe(res =>{
        if(res['response'] == 1){
          this.navCtrl.navigateRoot('/orders',{animated:true});
        }
      });
      
    }
    
  }
  async clearCurrentOrder() {
    await Storage.remove({ key: 'currentOrder' });
  }
  async cancelOrder() {
    const ret = await Storage.get({ key: 'barber' });
    const user = JSON.parse(ret.value);
    this.cancelOrder2(user.idBarber);
  }
  async presentToast(message:string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
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
  async modalCancelOrder() {
    const alert = await this.alertController.create({
      header: "Cancelar",
      subHeader:" Realmente deseas cancelar la orden?",
      message: "Recuerda que cancelar ordenes repetidamente resta puntos",
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
            this.cancelOrder();
            
          }
        }
      ]
    });

    await alert.present();
  }
  async modalFinishOrder() {
    const alert = await this.alertController.create({
      header: "Terminal la Orden",
      message: "Finaliza la orden solamente si ya recibiste el dinero por parte del cliente",
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Abort Cancellation');
          }
        }, {
          text: 'Finalizar',
          handler: () => {
            this.finishOrder();
          }
        }
      ]
    });

    await alert.present();
  }
  cancelOrder2(idBarber : string){
    console.log("idBarber",idBarber);
    var idOrder = this.idCurrentOrder;
    this.currentorderService.cancelOrder(parseInt(this.idCurrentOrder),parseInt(idBarber)).subscribe(res => {
      this.mensaje2 = res;
      if ( this.mensaje2.response === 2) {
        this.Alert('Timugo informa','Su orden se cancelo con exito',1);  
        this.clearCurrentOrder();
      }else if (this.mensaje2.response === 1){
        this.Alert('Timugo informa','La orden no se pudo cancelar porque el cliente no recibió notificación. Por favor contactar a soporte para cancelarla',2);
      }
    });  
  }
  finishOrder() {
    var idOrder = this.idCurrentOrder;
    var comment = this.formfinishOrder.value.comment || "sin comentario";
    var status = "Finished";
    console.log(idOrder,comment);
    this.currentorderService.finishOrder(parseInt(idOrder), comment, status).subscribe( res => {
      this.mensaje2 = res;
      if ( this.mensaje2.response === 2 ) {
        this.Alert('Tu Orden','Tu orden finalizo con exito, acumulaste 50 puntos',1);
        //clear key Order
        this.clearCurrentOrder();
      } 
      console.log(res);
    });
    
  }
}
