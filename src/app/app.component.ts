import { Component } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { CurrentOrderService } from './services/current-order.service';
import { Plugins } from '@capacitor/core';



const { SplashScreen } = Plugins
const { Storage} = Plugins;
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
              private navCtrl : NavController,
              private currentorderService: CurrentOrderService,
              private toastCtrl : ToastController
  ) {
    this.initializeApp();
    this.getBarber();
  }
  async getBarber() {
    
    const ret = await Storage.get({ key: 'barber' });
    const user = JSON.parse(ret.value);
    //if exists a barber save in the local storage
    if(user){
      // check if this barber is enrolled in a current order on progress
      this.currentorderService.validateIfExistsOrder(parseInt(user.phone)).subscribe(res =>{
        
        //if the server response with something
        if(res){
          //barber is in a current order
          if(res['response'] == 2){
            //navigate to the current order page
            this.navCtrl.navigateRoot('/current-order',{animated:true});
          }else{
            // if barber doesnt has any order in progress 
            if(res['response'] == 1){
              // then navigate to order page to search orders
              this.navCtrl.navigateRoot('/orders',{animated:true});  
            }
          }
        //if the server its down
        }else{
          this.message("Ups, hay un problema con tu conexion, revisala e intenta mas tarde");
        }
      });  
    }else{
      // if doesnt exists any registered barber then navigate to login page
      this.navCtrl.navigateRoot('/home',{animated:true});  
    } 
  }
  initializeApp() {
    SplashScreen.show({
      showDuration: 500,
      autoHide: true
    });

  }	 
  async message(mensaje: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 8000,
      color: 'primary',
      position: 'top'
    });
    toast.present();
  } 
}
