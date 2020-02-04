import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UiServiceService {

  constructor(private alertController:AlertController) { }

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
}
