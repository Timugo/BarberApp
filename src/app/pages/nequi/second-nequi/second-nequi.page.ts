import { Component, OnInit } from '@angular/core';
//Services
import { DataLocalService } from 'src/app/services/data-local.service';
import { PaymentsService } from 'src/app/services/payments.service';
import { NavController } from '@ionic/angular';
import { UiServiceService } from 'src/app/services/ui-service.service';

@Component({
  selector: 'app-second-nequi',
  templateUrl: './second-nequi.page.html',
  styleUrls: ['./second-nequi.page.scss'],
})
export class SecondNequiPage implements OnInit {
  codeQr : string = "";
  constructor(
              //services
              private localDataService : DataLocalService ,
              private paymentService : PaymentsService,
              private allertsService : UiServiceService,
              //navigation Controller.
              private navCtrl : NavController
              ) { }

  ngOnInit() {
    /* Check the payment automatic */
    this.checkPayment();
  }

  /*
    This function redirect to a page
    (the redirection cant be undone)
  */
  rootNavigate(page : string){
    this.navCtrl.navigateRoot(`/${page}`,{animated:true});
  }
  async checkPayment(){
    this.allertsService.presentLoading("Comprobando Pago..");
    //Fetch code Qr from local storage
    this.codeQr = await this.localDataService.getItem("codeQr");
    //Check push payment 
    this.paymentService.checkPushPayment(this.codeQr).subscribe((res)=>{
      if(res.response == 2){
        if(res.content.message == "APPROVED"){
          this.allertsService.dismissLoading();
          //show confirm toast
          this.allertsService.showToast(res.content.description + " Recuerda que puede tomar hasta 10 minutos en verse reflejado","success",7000)
          //delete Qr payment code after success
          this.localDataService.removeItem("codeQr");
          //Refirect Page to home
          this.rootNavigate("/orders");          
        } else if(res.content.message == "ACCEPTED") {
          this.allertsService.dismissLoading();
          // show toast
          this.allertsService.showToast(res.content.description,"secondary",4000);
        } else if ( res.content.message == "REJECTED"){
          this.allertsService.dismissLoading();
          //go home
          this.rootNavigate("/orders");
          //delete Qr payment code after failed
          this.localDataService.removeItem("codeQr");          
          //SHow toast
          this.allertsService.showToast(res.content.description,"danger",4000)
        }
      }else{
        this.allertsService.dismissLoading();
        this.allertsService.showToast("ERROR DE TRANSACCION INTENTA MAS TARDE","danger",5000);
      }
    },err=>{
      console.log(err);
      this.allertsService.dismissLoading();
      this.allertsService.showToast("ERROR DE TRANSACCION INTENTA MAS TARDE","danger",5000);
    }); 
  }
  
}
