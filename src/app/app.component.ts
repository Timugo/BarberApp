import { Component } from '@angular/core';

import { NavController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import { CurrentOrderService } from './services/current-order.service';


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
    if(user){
      this.currentorderService.validateIfExistsOrder(user.idBarber).subscribe(res =>{
        if(res['response'] == 2){
          this.navCtrl.navigateRoot('/current-order',{animated:true});
        }else{
          this.navCtrl.navigateRoot('/orders',{animated:true});  
        }
      });  
    }else{
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
