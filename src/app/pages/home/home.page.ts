import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { AlertController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  mensaje: any;
  formLogin: FormGroup;

  constructor(private router: Router,
              private loginService: LoginService,
              private fb: FormBuilder,
              public alertController: AlertController
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
      if (this.mensaje.response === 1) {
        this.Alert('Timugo alerta', this.mensaje.content, 1);
      } else if ( this.mensaje.response === 2 ) {
        this.router.navigate(['/orders']);
        console.log(formLogin.value.phone);
      }
    });
  }
}
