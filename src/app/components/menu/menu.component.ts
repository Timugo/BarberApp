import { Component, OnInit } from '@angular/core';
import { Componente, Barber } from 'src/app/interfaces/barber';
import { UiServiceService } from 'src/app/services/ui-service.service';

import { Observable } from 'rxjs';
import { Plugins } from '@capacitor/core';
import { LoginService } from 'src/app/services/login.service';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { Platform, AlertController, NavController } from '@ionic/angular';

//Native SDK plugins
const { Toast,Browser,Storage,Device} = Plugins;
const URL = environment.url;
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  componentes : Observable<Componente[]>;
  nameBarber : string ="Barber";
  imgBarber : string = "/assets/logo.png";
  pointsBarber :string = "0";
  barberId: string = "0";
  appVersion :string = "0.0.0";
  barber : Barber;
  balance : number = 50000;
  constructor(
              private dataService : UiServiceService,
              private loginService : LoginService,
              private router : Router,
              public platform: Platform,
              public alertController : AlertController,
              public navCtrl : NavController
              ) {
                this.getBarber2();
              }

  ngOnInit() {
    this.componentes = this.dataService.getMenuOpts();
    this.getAppVersion();
    
  }
  async getBarber2() {
    const ret = await Storage.get({ key: 'barber' });
    const user = JSON.parse(ret.value);
    //console.log("haciendo fetch del barbero",user);
    if(user){
      await this.loginService.getBarberInfo(user.phone).subscribe((res)=>{
        this.pointsBarber = res['content']['points']
        this.imgBarber = URL +"/"+ res['content']['urlImg']
        this.barberId = res['content']['id']
      });
    this.nameBarber =user.name;
    }else{
      this.router.navigate(["home"]);
    }
    
  }
  async getAppVersion(){
    var device = await Device.getInfo();
    //console.log(device);
    this.appVersion = device.appVersion || "web version"; 
  }
  async contactSupport(){
    var message = "Hola, soy%20"+this.nameBarber +"%20barbero%20de%20timugo%20con%20ID:%20"+this.barberId+"%20y%20tengo%20el%20siguiente%20problema:%20(describir el problema)";
    await Browser.open({ url: 'https://wa.me/573162452663?text='+message });
  }
  async rateApp(){
    if(this.platform.is("android")){
      await Browser.open({ url: 'https://play.google.com/store/apps/details?id=com.timugo.barberApp&hl=es' });
    }
    else{
      if(this.platform.is("ios")){
        await Browser.open({ url: 'https://apps.apple.com/co/app/somos-timugo/id1497415210?ls=1' });
      }
    }
  }
  async showToast() {
    await Toast.show({
      text: 'Sigue obteniendo mas puntos y obtendras beneficios :)'
    });
  }
  async logOut() {
    const alert = await this.alertController.create({
      mode:"ios",
      header: "Cerrar Sesion",
      message: "Realmente deseas salir?",
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
            //clear the local storage
            this.clear();
            //redirect to first login page
            this.navCtrl.navigateRoot('/first',{animated:true});

            
          }
        }
      ]
    });

    await alert.present();
    
  }
  navigateTo(option : string){  
    this.router.navigate([`/${option}`]);
  }
  async clear() {
    await Storage.clear();
  }
  
  

}
