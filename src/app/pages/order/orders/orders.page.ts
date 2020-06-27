/* Angular Dependencies */ 
import { Component, OnInit, ViewChild } from '@angular/core';
import { 
  AlertController,
  IonList,
  NavController,
  ToastController,
  MenuController
} from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
//Interfaces to be Used to manage data
import { Barber, Componente } from '../../../interfaces/barber';
import { Observable } from 'rxjs';
/* Services */
import { DataLocalService } from '../../../services/data-local.service';
import { OrdersService } from '../Services/orders.service';
import { UiServiceService } from 'src/app/services/ui-service.service';
//Capacitor plugins 
import { Plugins } from '@capacitor/core';
/* Enviroments  */
import { environment} from '../../../../environments/environment';
//Library to Play local audios
import { LoginService } from 'src/app/services/login.service';
import { OrderHistory } from '../interfaces/order';
//socket importation
//import { Socket } from 'ngx-socket-io';
//Using 
const { LocalNotifications} = Plugins;


@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {
  /* External variables */
  @ViewChild('lista') lista: IonList;
  /* Page variables */
  activeMenu :string; //To hide the side menu
  ordenes: [OrderHistory]; //Array of orders (needs to import an interface)
  flagOrdenes: boolean; //if exists orders
  flagNoOrdenes: boolean; //if doesnt exists any orders 
  city: string; //city of the current barber
  barber: Barber; //The current barber un the session -import a interface
  titulo: string; //tittle of the page
  componentes: Observable<Componente[]>; 
  conection : boolean ;

  constructor(
    private datalocalService: DataLocalService,
    private loginService : LoginService,
    private router: Router,
    private ordersService: OrdersService,
    public alertController: AlertController,
    private navCtrl: NavController,
    private dataService : UiServiceService,
    private toastCtrl : ToastController,
    public platform: Platform,
    private menu:MenuController,
  ) {
    //Named the current side menu
    this.activeMenu = 'first';
    //Enable side menu to handle it
    this.menu.enable(true, this.activeMenu);
    //get current barber info 
    this.getBarber2(); 
  }          
  ngOnInit() {
    /* Testing message*/
    if(environment.message =="DEVELOPMENT MODE"){
      this.titulo = "Development Mode";
    }else{
      this.titulo = "Servicios"
    }
    /* Check if barber is Charging money */
    this.checkPayment();
    //Charge the options to display in the side menu
    this.componentes = this.dataService.getMenuOpts();  
  }
  /*
    This function check if exists a propertie
    named QR in the local Storage if exists, then redirect the 
    view to current payment page
  */
  checkPayment(){
    this.datalocalService.getItem('codeQr')
      .then(response =>{
        if(response){
          this.navCtrl.navigateRoot('/second-nequi',{animated:true},);
        }
      })
      .catch(err => console.log(err));
  }   
  //Check if the barber is currently connected or disconected
  checkBarberConection(barber:Barber){
    this.ordersService.checkConnection(parseInt(barber.phone))
      .subscribe((response)=>{
        if(response["response"] == 2){
          this.conection = true;
        }else{
          this.conection = false;
        }
      },err=>{
        console.log(err);
      });
  }
  connect(){
    this.ordersService.connectOrDisconnect(parseInt(this.barber.phone)).subscribe((res)=>{
      if(res["response"] ==2 ){
        this.conection = res["content"]["user"]["connected"];
      }
      //reload Order after connect or disconnect
      this.getOrders()
    });
  }
  //Coonection of the barber to recieve new orders 
  async connectBarber(){
    //First the barber need to listen the socket so he can now recieve new orders if he is active
    //this.socket.connect();
  }
  //Display a toast allert
  async message(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 8000,
      color: 'primary',
      position: 'top'
    });
    toast.present();
  }
  //Get barber information from local storage
  async getBarber2() {
    const user : Barber = await this.datalocalService.getBarber();
    this.barber = user;
    console.log(this.barber);
    //if the barber exists in local storage
    if(user){
      /* Get Barber Balance  */
      this.loginService.getBarberInfo(user.phone)
        .subscribe(res=>{
          /* Set the propertie balance  */
          this.barber.balance = res["content"]["balance"];
          
        });
      //then we can search new orders
      this.getOrders();
      //Check if barber is connected 
      this.checkBarberConection(user);
    }else{
      //if not, then redirect barber to home login page
      this.navCtrl.navigateRoot('/first',{animated:true},);
    }
  }
  //function to recieve new orders and refresh
  getOrders(){
    this.ordersService.getAvailableOrders(this.barber.city,parseInt(this.barber.phone))
      .subscribe( res => {
       
        if(res.response === 1) {
          this.flagOrdenes = false;
          this.flagNoOrdenes = true;
        } else if ( res.response === 2 ) {
          this.ordenes = res.content;
          //this.ordenes = res.content;
          
          this.flagOrdenes = true;
          this.flagNoOrdenes = false;
        }
      },err=>{
        this.Alert("Ups","Tenemos problemas para cargar las ordenes, intenta mas tarde")
      });

  }
  //display an allert 
  async Alert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: [
        {
          text: 'OK',
          handler: ( ) => {
            
          }
        }
      ]
    });
    //show the allert ins screen
    await alert.present();
  }
  //TO Confirme take order
  tomarOrden(codigoOrden: number){
    this.presentAlertConfirm('Confirmacion la Orden','¿Deseas tomarla?',codigoOrden);
  }
  //second step to take the order
  async presentAlertConfirm(titulo: string, mensaje: string, codigoOrden: number) {
    const alert = await this.alertController.create({
      translucent:false,
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
            this.ordersService.assingBarberToOrder(codigoOrden,parseInt(this.barber.phone))
              .subscribe( res => {
                //if the barber took the order correctly
                if (res.response === 2 ) {
                  //then redirect to current order page to see the order info
                  this.router.navigate(['/current-order']);
                  //close sliding items in the list
                  this.lista.closeSlidingItems();
                  //if existe an error
                } else if (res.response === 1) {
                  //display an allert
                  this.Alert('Upss','La orden no se encontro o fue tomada por otro barbero. Por favor desliza la pantalla hacia abajo para recargar.') 
                }
              });
          }
        }
      ]
    });
    await alert.present();
  }  
  /*
    Function to make pull to refresh page
  */
  doRefresh(event : any) {
    this.getBarber2(); 
    setTimeout(() => {
      this.getOrders();
      event.target.complete();
    }, 2000);
  }
}