// Angular dependencies
import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
// Services
import { OrdersService } from '../Services/orders.service';
import { DataLocalService } from "src/app/services/data-local.service";
// Interfaces
import { Barber } from 'src/app/interfaces/barber';
import { OrderHistory } from "../interfaces/order";
// Capacitor dependencies
import { Plugins } from '@capacitor/core';
const { Storage,Clipboard,Device } = Plugins;

@Component({
  selector: 'app-current-order',
  templateUrl: './current-order.page.html',
  styleUrls: ['./current-order.page.scss'],
})

export class CurrentOrderPage implements OnInit {

  currentOrder: OrderHistory;
  barber:Barber;
  idCurrentOrder :string;

  constructor(
    private currentorderService: OrdersService,
    private alertController: AlertController,
    private router: Router,
    private navCtrl : NavController,
    private toastController: ToastController,
    private storageService : DataLocalService,
  ) { }

  ngOnInit() {
    this.checkIfOrderExistsInServer();
  }

  /*
    Get the info of current order 
    from server request
  */
  getInfoOrder(idOrder:number){
    this.idCurrentOrder = idOrder.toString();
    this.currentorderService.getInfoCurrentOrder(idOrder)
      .subscribe(res => {
        /* All info of current order */
        this.currentOrder = res.content.order;
      },err=>{
        this.Alert('Error!','No se pudo obtener la informacion de la orden, por favor contacta con soporte.');
      });
  }
  /*
  *  This function open a new window to
  *  redirect phone app (only in android) with the client
  *  phone, if platform is Ios or Web, then copy the number to
  *  clipboard
  */
  callClient(){
    // Check the device information
    Device.getInfo()
      .then(info=>{
        console.log(info.platform);
        // Android Case
        if(info.platform == "android"){
          window.open('tel:' + this.currentOrder.phoneClient);
        } else {
          //Other Case (IOS, Web)
          Clipboard.write({
            string: this.currentOrder.phoneClient.toString()
          });
          this.presentToast("Numero Copiado!");
        }
      });
  }
  finishOrder() {
    var idOrder = this.idCurrentOrder;
    var status = "Finished";
    this.currentorderService.finishOrder(parseInt(idOrder), status)
      .subscribe( response => {
        if ( response.response === 2 ) {
          this.Alert('Genial!','La orden finalizo con exito');
          //clear key Order
          this.storageService.removeItem('currentOrder');
        } 
      },err=>{
        this.Alert('Error!','La orden no se pudo finalizar, por favor contacta con soporte');
      });
    
  }
  doRefresh(event : any) {
    this.checkIfOrderExistsInServer();
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 1000);
  }
  async checkIfOrderExistsInServer(){
    const barber: Barber = await this.storageService.getObject("barber");
    if(barber){
      this.currentorderService.validateIfExistsOrder(parseInt(barber.phone))
        .subscribe(res =>{
          if(res.response == 1){
            this.navCtrl.navigateRoot('/orders',{animated:true});
          }else{
            if(res.response == 2){
              this.getInfoOrder(res.content["id"]);
            }
          }
        },error=>{
          this.Alert('Error!','No se pudo traer la informacion de la orden, por favor contacta con soporte.');
        });
    }
  }
  /*
  *  This function Check the status of current order in the server,
  *  if order was cancelled by client, then redirecto to orders
  *  if order is active, then show the Cancel Alert
  */
  async cancelCurrentOrder(){
    const barber: Barber = await this.storageService.getObject("barber");
    if(barber){
      this.currentorderService.validateIfExistsOrder(parseInt(barber.phone))
        .subscribe(res =>{
          if(res.response == 1){
            this.navCtrl.navigateRoot('/orders',{animated:true});
            this.presentToast("Ups, el cliente cancelo la orden");
          }else if(res.response == 2){
            this.cancelOrFinishOrderAlert("Cancelar"," Realmente deseas cancelar la orden?","Recuerda que cancelar ordenes repetidamente resta puntos","cancel","Ok");
          }
        },err =>{
          this.Alert('Error!','No se pudo cancelar la orden, por favor contacta con soporte.');
        });
    }
  }
  /*
  *  This function Check the status of current order in the server,
  *  if order was cancelled by client, then redirecto to orders
  *  if order is active, then show the finish Alert
  */
  async finishCurrentOrder(){
    const barber: Barber = await this.storageService.getObject("barber");
    if(barber){
      this.currentorderService.validateIfExistsOrder(parseInt(barber.phone))
        .subscribe(res =>{
          if(res.response == 1){
            this.navCtrl.navigateRoot('/orders',{animated:true});
            this.presentToast("Ups, el cliente cancelo la orden");
          }else if(res.response == 2){
            this.cancelOrFinishOrderAlert("Terminal la Orden","","Finaliza la orden solamente si ya recibiste el dinero por parte del cliente","finish","Finalizar");
          }
      });
    }
  }
  /*
  * This function allows barber to cancel the order and if
  * succes, then redirect to orders
  */
  async cancelOrder() {
    // Get barber info from storage
    const barber : Barber = await this.storageService.getObject("barber");
    // cancell the order
    this.currentorderService.cancelOrder(parseInt(this.idCurrentOrder),barber.idBarber)
      .subscribe(response => {
        if ( response.response === 2) {
          this.Alert('Timugo informa','Su orden se cancelo con exito');  
          this.storageService.removeItem('currentOrder');
        }else if (response.response === 1){
          this.Alert('Mensaje','La orden no se pudo cancelar porque el cliente no recibió notificación. Por favor contactar a soporte para cancelarla');
        }
      },err=>{
        this.Alert('Error!','La orden no se pudo cancelar, por favor contacta con soporte');
      });  
    
  }
  /*
    Extra components function
  */
  async presentToast(message:string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: 'primary',
      position: 'top'
    });
    toast.present();
  }
  async cancelOrFinishOrderAlert(header:string,subHeader :string, message : string,action : "cancel"| "finish",buttonOK : string) {
    const alert = await this.alertController.create({
      header,
      subHeader,
      message,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: buttonOK,
          handler: () => {
            if(action=="cancel"){
              this.cancelOrder();
            }else if( action == "finish"){
              this.finishOrder();
            }
            
          }
        }
      ]
    });
    await alert.present();
  }
  async Alert(title: string, message: string) {
    const alert = await this.alertController.create({
      header: title,
      message,
      buttons: [
        {
          text: 'OK',
          handler: ( ) => {
            this.router.navigate(['/orders']);
          }
        }
      ]
    });
    await alert.present();
  }
}
