import { Injectable } from '@angular/core';
import { AlertController, ToastController, LoadingController } from '@ionic/angular';
import { HttpClient} from '@angular/common/http';
import { Componente} from '../interfaces/barber';
@Injectable({
  providedIn: 'root'
})
export class UiServiceService {
  //fot loading
  isLoading = false;
  constructor(
              private alertController:AlertController,
              private http: HttpClient,
              private toastCtrl : ToastController,
              public loadingController: LoadingController
            ) { }

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
  async showToast(message:string, color : string,duration : number) {
    const toast = await this.toastCtrl.create({
      color : color,
      message: message,
      duration: duration
    });
    toast.present();
  }
  getMenuOpts(){
    
    return this.http.get<Componente[]>("/assets/data/menu.json");
  }

  async presentLoading(message :string) {
    this.isLoading = true;
    return await this.loadingController.create({
      message: message,
      spinner :"dots",
      
      // duration: 5000,
    }).then(a => {
      a.present().then(() => {
        console.log('presented');
        if (!this.isLoading) {
          a.dismiss().then(() => console.log('abort presenting'));
        }
      });
    });
  }

  async dismissLoading() {
    this.isLoading = false;
    return await this.loadingController.dismiss().then(() => console.log('dismissed'));
  }

  

  
}
