import { Barber } from './../../interfaces/barber';
import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { AlertController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, NavigationExtras } from '@angular/router';
import { DataLocalService } from '../../services/data-local.service';

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
              private datalocalService: DataLocalService
              ) { }

  ngOnInit() {
    this.formLogin = this.fb.group({
      phone: [null, Validators.compose([Validators.required, Validators.minLength(10)])]
    });
  }

  async Alert(titulo: string, mensaje: string, accion: number) {
    const alert = await this.alertController.create({
      header: titulo,
      // subHeader: 'Subtitle',
      message: mensaje,
      // buttons: ['OK']
      buttons: [
        {
          text: 'OK',
          handler: ( ) => {
            if ( accion === 1 ) {
              this.formLogin.reset();
            }
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();

  }

  login(formLogin: FormGroup) {
    this.loginService.postBarber(formLogin.value.phone).subscribe( res => {
      this.mensaje = res;
      console.log(res);
      if (this.mensaje.response === 1) {
        this.Alert('Timugo alerta', this.mensaje.content, 1);
      } else if ( this.mensaje.response === 2 && !(this.mensaje.content.message === "Barbero logeado, pero con pedido en curso") ) {
        // console.log(this.mensaje.content.message);
        let navigationExtras : NavigationExtras = {
          queryParams: {
            city: this.mensaje.content.barber.city
          }
        }  
        this.barbero = {
          idBarber: this.mensaje.content.barber.id,
          name: this.mensaje.content.barber.name,
          lastName: this.mensaje.content.barber.lastName,
          city: this.mensaje.content.barber.city,
        };
        console.log('BARBERO',this.barbero);
        this.datalocalService.guardarInfoBarbero(this.barbero);
        this.router.navigate(['/orders'], navigationExtras);
      } else if ( this.mensaje.response === 2 && this.mensaje.content.message === "Barbero logeado, pero con pedido en curso" ) {
        console.log("orden actual:",this.mensaje.content.order.id);
        this.datalocalService.guardarInfoCurrentOrder(this.mensaje.content.order.id);
        this.router.navigate(['/current-order']);
      }
    });
  }
}
