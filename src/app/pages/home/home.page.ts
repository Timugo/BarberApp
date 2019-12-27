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
              public alertController: AlertController,
              private fb: FormBuilder
              ) { }

  ngOnInit() {
    this.formLogin = this.fb.group({
      phone: [null, Validators.required]
    });
  }

  login(formLogin: FormGroup){
    this.loginService.postBarber(formLogin.value.phone).subscribe( async res => {
      this.mensaje = res;
      if (this.mensaje.response === 1) {
        const alert = await this.alertController.create({
          header: 'UPS Parcero',
          // subHeader: 'Parcero',
          message: 'No encontramos ningun barbero con ese Celular',
          buttons: ['OK']
        });
        await alert.present();
      } else {
        this.router.navigate(['/orders']);
        console.log(formLogin.value.phone);
      }
    });
  }
}
