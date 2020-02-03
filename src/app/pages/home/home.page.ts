import { Barber } from './../../interfaces/barber';
import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { AlertController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, NavigationExtras } from '@angular/router';
import { DataLocalService } from '../../services/data-local.service';
import { Plugins } from '@capacitor/core';

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
              private datalocalService: DataLocalService,
              ) { }

  ngOnInit() {
    this.formLogin = this.fb.group({
      phone: [null, Validators.compose([Validators.required, Validators.minLength(10)])]
    });
    
  }

  async getObject() {
    const ret = await Storage.get({ key: 'barber' });
    const user = JSON.parse(ret.value);
  }
  async Alert(titulo: string, mensaje: string, accion: number) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: [
        {
          text: 'OK',
          handler: ( ) => {
            // if ( accion === 1 ) {
            //   this.formLogin.reset();
            // }
            console.log('Confirm Okay');
          }
        }
      ]
    });
    await alert.present();
  }

  login(formLogin: FormGroup) {
    this.loginService.login(formLogin.value.phone);
  }
}
