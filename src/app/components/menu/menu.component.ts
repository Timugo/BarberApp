/* Angular dependencies */
import { Platform, AlertController, NavController } from '@ionic/angular';
import { Component, OnInit, Input } from '@angular/core';
import { Componente, Barber } from 'src/app/interfaces/barber';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
/* Services */
import { UiServiceService } from 'src/app/services/ui-service.service';
import { LoginService } from 'src/app/services/login.service';
import { DataLocalService } from 'src/app/services/data-local.service';
/* Plugins */
import { Plugins } from '@capacitor/core';
/* Enviroments */
import { environment } from 'src/environments/environment';

const { Toast,Browser,Device} = Plugins;
const URL = environment.url;
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  @Input() balance : number;
  @Input() points : number = 0;
  componentes : Observable<Componente[]>;
  nameBarber : string ="Barbero";
  imgBarber : string = "/assets/logo.png";
  pointsBarber :number = 0;
  barberId: string = "0";
  appVersion :string = "0.0.0";
  barber : Barber;
  colorBalance : string = "success";
  constructor(
    private dataService : UiServiceService,
    private loginService : LoginService,
    private router : Router,
    public platform: Platform,
    public alertController : AlertController,
    public navCtrl : NavController,
    public storageService : DataLocalService
  ) { }

  ngOnInit() {
    this.componentes = this.dataService.getMenuOpts();
    this.getBarberInfo();
    this.getAppVersion();
    
  }
  async getBarberInfo() {
    const user : Barber = await this.storageService.getBarber();
    if(user){
      this.nameBarber =user.name;
      this.loginService.getBarberInfo(user.phone)
        .subscribe((res)=>{
          
          this.pointsBarber = res['content']['points']
          this.imgBarber = URL +"/"+ res['content']['urlImg']
          this.barberId = res['content']['id']
          //this.balance = res["content"]["balance"];
          this.pointsBarber = res["content"]["points"];
          if(this.balance < 0){
            this.colorBalance = "danger";
          }
        },
        err=>{console.log(err);});
    }else{
      /* 
        If no exists barber in local storage,
        then redirect to login 
      */
      this.router.navigate(["home"]);
    }
    
  }
  async getAppVersion(){
    var device = await Device.getInfo();
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
            this.storageService.clearStorage();
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
}
