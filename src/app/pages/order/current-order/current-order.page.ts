// Angular dependencies
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,} from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
// Services
import { CurrentOrderService } from 'src/app/services/current-order.service';
// Interfaces
import { Barber } from 'src/app/interfaces/barber';
import { OrderHistory } from "../../../interfaces/order";
// Capacitor dependencies
import { Plugins } from '@capacitor/core';
const { Storage,Clipboard,Device } = Plugins;

@Component({
  selector: 'app-current-order',
  templateUrl: './current-order.page.html',
  styleUrls: ['./current-order.page.scss'],
})

export class CurrentOrderPage implements OnInit {

  mensaje: any;
  mensaje2: any;
  currentOrder: OrderHistory;
  formfinishOrder: FormGroup;
  barber:Barber;
  idCurrentOrder :string;

  constructor(
    private currentorderService: CurrentOrderService,
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
    this.checkIfOrderExistsInServer();
  }
  async loadCurrentOrder(){
    const { value } = await Storage.get({ key: 'currentOrder' });
    this.getInfoOrder(parseInt(value));
  }
  async checkIfOrderExistsInServer(){
    const ret = await Storage.get({ key: 'barber' });
    const user = JSON.parse(ret.value);
    if(user){
      this.currentorderService.validateIfExistsOrder(parseInt(user.phone)).subscribe(res =>{
        if(res['response'] == 1){
          this.navCtrl.navigateRoot('/orders',{animated:true});
        }else{
          if(res['response'] == 2){
            this.getInfoOrder(res["content"].id);
          }
        }
      });
    }
  }
  /*
    Get the info of current order 
    from server request
  */
  getInfoOrder(idOrder:number){
    this.idCurrentOrder = idOrder.toString();
    this.currentorderService.getInfoCurrentOrder(idOrder).subscribe(res => {
      console.log(res);
      /* All info of current order */
      this.currentOrder = res.content.order;
    });
  }
  /*
    This function open a new window to
    redirect phone app with the client
    phone
  */
  callClient(){
    // Check the device information
    Device.getInfo()
      .then(info=>{
        // Android Case
        if(info.platform == "android"){
          window.open('tel:' + this.currentOrder.phoneClient);
        } else if ( info.platform == "ios") {
          //Ios case
          Clipboard.write({
            string: this.currentOrder.phoneClient.toString()
          });
          this.presentToast("Numero Copiado!");
        }
      })
  }
  /*
    This function cancel the current order,
    and show the alert message to barber
  */
  async cancelCurrentOrder(){
    const ret = await Storage.get({ key: 'barber' });
    const user = JSON.parse(ret.value);
    if(user){
      this.currentorderService.validateIfExistsOrder(parseInt(user.phone)).subscribe(res =>{
        console.log("respuesta del servidor de si esta en una orden asociado"+ res["response"] + res["content"].id);
        if(res['response'] == 1){
          this.navCtrl.navigateRoot('/orders',{animated:true});
          this.message("Ups, el cliente cancelo la orden");
        }else{
          if(res['response'] == 2){
            this.modalCancelOrder();
          }
        }
      });
    }
  }
  async finishCurrentOrder(){
    const ret = await Storage.get({ key: 'barber' });
    const user = JSON.parse(ret.value);
    if(user){
      this.currentorderService.validateIfExistsOrder(parseInt(user.phone)).subscribe(res =>{
        console.log("respuesta del servidor de si esta en una orden asociado"+ res["response"] + res["content"].id);
        if(res['response'] == 1){
          this.navCtrl.navigateRoot('/orders',{animated:true});
          this.message("Ups, el cliente cancelo la orden");
        }else{
          if(res['response'] == 2){
            this.modalFinishOrder();
          }
        }
      });
    }
  }
  async clearCurrentOrder() {
    await Storage.remove({ key: 'currentOrder' });
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
  async cancelOrder() {
    const ret = await Storage.get({ key: 'barber' });
    const user = JSON.parse(ret.value);
    this.cancelOrder2(user.idBarber);
  }
  cancelOrder2(idBarber : string){
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
    this.currentorderService.finishOrder(parseInt(idOrder), comment, status)
      .subscribe( response => {
        if ( response.response === 2 ) {
          this.Alert('Genial!','La orden finalizo con exito',1);
          //clear key Order
          this.clearCurrentOrder();
        } 
      });
    
  }
  doRefresh(event) {
    this.checkIfOrderExistsInServer();
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 1000);
  }
  /*
    Extra components function
  */
  async presentToast(message:string) {

    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }
  async message(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 8000,
      color: 'primary',
      position: 'top'
    });
    toast.present();
  }
  async Alert(titulo: string, mensaje: string, accion: number) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
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
}
