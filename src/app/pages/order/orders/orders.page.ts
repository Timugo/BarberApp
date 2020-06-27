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
  //Array of the sounds to play with HOWL library
  activeMenu :string; //To hide the side menu
  ordenes: Observable<any>; //Array of orders (needs to import an interface)
  flagOrdenes: boolean; //if exists orders
  flagNoOrdenes: boolean; //if doesnt exists any orders
  mensaje: any;
  mensaje2: any; 
  city: string; //city of the current barber
  barber: Barber; //The current barber un the session -import a interface
  titulo: string; //tittle of the page
  nameBarber:string="none"
  componentes: Observable<Componente[]>; //listo of components in the menu
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
    this.ordersService.checkConnection(parseInt(barber.phone)).subscribe((response)=>{
      if(response["response"] == 2){
        this.conection = true;
      }else{
        this.conection = false;
      }
    });
  }
  connect(){
    this.ordersService.connectOrDisconnect(parseInt(this.barber.phone)).subscribe((res)=>{
      if(res["response"] ==2 ){
        this.conection = res["content"]["user"]["connected"];
      }
      //reload Order after connect or disconnect
      this.getOrders(this.barber)
    });
  }
  //Coonection of the barber to recieve new orders 
  async connectBarber(){
    //First the barber need to listen the socket so he can now recieve new orders if he is active
    //this.socket.connect();
  }
  //Display a toast allert
  async message(mensaje: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 8000,
      color: 'primary',
      position: 'top'
    });
    toast.present();
  }
  //Get barber information from local storage
  async getBarber2() {
    const user : Barber = await this.datalocalService.getBarber();
    //if the barber exists in local storage
    if(user){
      /* Get Barber Balance  */
      this.loginService.getBarberInfo(user.phone)
        .subscribe(res=>{
          /* Set the propertie balance  */
          this.barber.balance = res["content"]["balance"];
          
        })
      //then we can search new orders
      this.getOrders(user);
      //Check if barber is connected 
      this.checkBarberConection(user);
    }else{
      //if not, then redirect barber to home login page
      this.navCtrl.navigateRoot('/first',{animated:true},);
    }
  }
  //function to recieve new orders and refresh
  getOrders(barber:Barber){
    this.barber = barber;
    if(environment.message =="DEVELOPMENT MODE"){
      this.titulo = "Development Mode";
    }else{
      this.titulo = "Servicios"
    }
    this.ordersService.getAvailableOrders(barber.city,parseInt(barber.phone)).subscribe( res => {
      this.mensaje = res;
      if(this.mensaje.response === 1) {
        this.flagOrdenes = false;
        this.flagNoOrdenes = true;
      } else if ( this.mensaje.response === 2 ) {
        this.ordenes = this.mensaje.content;
        this.flagOrdenes = true;
        this.flagNoOrdenes = false;
      }
    });

  }
  //display an allert 
  async Alert(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: [
        {
          text: 'OK',
          handler: ( ) => {
            //if press OK button
            console.log('Confirm Okay');
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
            this.ordersService.assingBarberToOrder(codigoOrden,parseInt(this.barber.phone)).subscribe( res => {
              this.mensaje2 = res;
              //if the barber took the order correctly
              if (this.mensaje2.response === 2 ) {
                //then redirect to current order page to see the order info
                this.router.navigate(['/current-order']);
                //close sliding items in the list
                this.lista.closeSlidingItems();
                //if existe an error
              } else if (this.mensaje2.response === 1) {
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
    this.ordersService.getAvailableOrders(this.barber.city,parseInt(this.barber.phone))
      .subscribe( res => {
        this.mensaje = res;
        if(this.mensaje.response === 1) {
          this.flagOrdenes = false;
          this.flagNoOrdenes = true;
        } else if ( this.mensaje.response === 2 ) {
          this.ordenes = this.mensaje.content;
          this.flagOrdenes = true;
          this.flagNoOrdenes = false;
        }
        //Wait to refresh (just a estetic view)
        setTimeout(() => {
          event.target.complete();
        }, 2000);

        
      },
      err =>{
        console.log(err);
      });
  }
}