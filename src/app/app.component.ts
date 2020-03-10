import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
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
}
