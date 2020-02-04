import { Barber } from './../../interfaces/barber';
import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { AlertController, NavController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, NavigationExtras } from '@angular/router';
import { DataLocalService } from '../../services/data-local.service';
import { Plugins } from '@capacitor/core';
import { UiServiceService } from 'src/app/services/ui-service.service';

const { Storage } = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  mensaje: any;
  formLogin: FormGroup;
  barbero: Barber;

  constructor(private router: Router,
              private loginService: LoginService,
              private fb: FormBuilder,
              public alertController: AlertController,
              private navCtrl: NavController,
              private uiService :UiServiceService
              ) { }

  ngOnInit() {
    this.getBarber();
    this.formLogin = this.fb.group({
      phone: [null, Validators.compose([Validators.required, Validators.minLength(10)])]
    });
    
  }

  async getBarber() {
    const ret = await Storage.get({ key: 'barber' });
    const user = JSON.parse(ret.value);
    if(user){
      this.navCtrl.navigateRoot('/orders',{animated:true});
    }
  }
  
  

  async login(formLogin: FormGroup) {
    
    const valid = await this.loginService.login(formLogin.value.phone);
    if(valid){
      this.navCtrl.navigateRoot('/orders',{animated:true});
    }else{
      this.uiService.Alert("Login","No encontramos ese Celular.",1)
    }
  }
}
