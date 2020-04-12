import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController, NavController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
//Services
import { PaymentsService } from 'src/app/services/payments.service';
import { DataLocalService } from "src/app/services/data-local.service";
//Imterfaces
import { Barber } from 'src/app/interfaces/barber';
//PLugins
import { Plugins } from '@capacitor/core';
import { UiServiceService } from 'src/app/services/ui-service.service';

const { Storage } = Plugins;

@Component({
  selector: 'app-first-nequi',
  templateUrl: './first-nequi.page.html',
  styleUrls: ['./first-nequi.page.scss'],
})
export class FirstNequiPage implements OnInit {
  money : number = 20000;
  barber : Barber;
  buttonState : boolean = false;
  constructor(
    private alertCtrl : AlertController,
    private router : Router,
    //services
    private paymentService :PaymentsService,
    private localDataService : DataLocalService,
    private allertsService : UiServiceService,
    //to display todast
    private toastCtrl : ToastController,
    //navigation Controller.
    private navCtrl : NavController,
    private loadingCtrl : LoadingController,
  ) { }

  ngOnInit() {
  }
  navigateTo(option : string){  
    this.router.navigate([`/${option}`]);
  }
  rootNavigate(page : string){
    this.navCtrl.navigateRoot(`/${page}`,{animated:true});
  }
  async beginPayment(){
    //present loading
    this.allertsService.presentLoading("Procesando..");
    //disable button
    this.buttonState = true;
    // get barber from local storage
    this.barber = await this.searchBarber();
    
    //begin payment from paymentService Service
    this.paymentService.makePushPayment(this.barber.phone.toString(),this.money.toString()).subscribe((res)=>{
      //handle responses
      console.log(res);
      if(res.response == 2){
        if(res.content.message == "REJECTED"){
          this.presentToast(res.content.description,"danger",4000);
          //re- enable next button
          this.buttonState = false;
          this.allertsService.dismissLoading();
        }else if(res.content.message == "ACCEPTED"){
          //dismiss loading
          this.allertsService.dismissLoading();
          //save code payment in local storage
          this.localDataService.saveInfoQr(res.content.codeQR);
          //navigate to the next page
          this.rootNavigate("second-nequi");
          //display confirmation message
          this.presentToast(res.content.description,"primary",5000);
        }
      }else{
        this.presentToast("Un error ha ocurrido por favor intenta mas tarde y contacta con soporte","danger",6000);
        this.allertsService.dismissLoading();
      }
    });

  }

  //Search barber in the local storage
  async searchBarber(){
    const ret = await Storage.get({ key: 'barber' });
    const user = JSON.parse(ret.value);
    //if the barber exists in local storage
    if(user){ 
      return user;
    }else{
      return "";
    }
  }
  async presentToast(message:string, color : string,duration : number) {
    const toast = await this.toastCtrl.create({
      color : color,
      message: message,
      duration: duration
    });
    toast.present();
  }
  decreaseMoney(){
    if(this.money > 20000){
      this.money = this.money - 1000;
    }else{
      this.presentAlert();
    }
  }
  addMoney(){
    this.money = this.money + 1000;
  }
  async presentAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Recuerda',
      mode:"ios",
      message: 'La recarga minima es de $20.000',
      buttons: ['OK']
    });

    await alert.present();
  
  }
  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Procesando...',
      duration: 10000000
    });
    await loading.present();
    const { role, data } = await loading.onDidDismiss();    
  }
 
}
