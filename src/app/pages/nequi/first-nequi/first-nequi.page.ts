import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-first-nequi',
  templateUrl: './first-nequi.page.html',
  styleUrls: ['./first-nequi.page.scss'],
})
export class FirstNequiPage implements OnInit {
  money : number = 20000;
  constructor(
    private alertCtrl : AlertController 
  ) { }

  ngOnInit() {
  }
  holiwas(){
    console.log("holi");
  }
  decreaseMoney(){
    if(this.money > 20000){
      this.money = this.money - 1000;
    }else{
      this.presentAlert();
    }
  }
  addMoney(){
    this.money = this.money + 1000;
  }

  async presentAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Recuerda',
      mode:"ios",
      message: 'La recarga minima es de $20.000',
      buttons: ['OK']
    });

    await alert.present();
  }
}
