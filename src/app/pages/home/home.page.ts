import { Barber } from './../../interfaces/barber';
import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { AlertController, NavController, MenuController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router,} from '@angular/router';
import { Plugins } from '@capacitor/core';
import { UiServiceService } from 'src/app/services/ui-service.service';

const { Storage,Device } = Plugins;



@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  mensaje: any;
  formLogin: FormGroup;
  barbero: Barber;
  activeMenu: string;
  disableButton :Boolean;
  constructor(private loginService: LoginService,
              private fb: FormBuilder,
              public alertController: AlertController,
              private navCtrl: NavController,
              public menu: MenuController
              ) { 
                this.menu1Active();
              }

  ngOnInit() {
    this.getBarber();
    this.formLogin = this.fb.group({
      phone: [null, Validators.compose([Validators.required, Validators.minLength(10)])]
    });
    
  }
  //disable menu in the login page
  menu1Active() {
    this.activeMenu = 'first';
    this.menu.enable(false, this.activeMenu);
  
  }

  async getBarber() {
    const ret = await Storage.get({ key: 'barber' });
    const user = JSON.parse(ret.value);
    if(user){
      this.navCtrl.navigateRoot('/orders',{animated:true});
    }
  }
  
  

  // async login(formLogin: FormGroup) {
    
  //   const valid = await this.loginService.login(formLogin.value.phone);
  //   if(valid){
  //     this.navCtrl.navigateRoot('/orders',{animated:true});
  //   }else{
  //     this.uiService.Alert("Login","No encontramos ese Celular.",1)
  //   }
  // }
  login(formLogin: FormGroup) {
    this.loginService.login(formLogin.value.phone);
  }
}
