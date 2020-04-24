import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-balance-charge-explai',
  templateUrl: './balance-charge-explai.page.html',
  styleUrls: ['./balance-charge-explai.page.scss'],
})
export class BalanceChargeExplaiPage implements OnInit {

  paymentChoice : string = "Nequi (Recomendado)";

  constructor() { }

  ngOnInit() {
  }
  changeMethod(ev: any){
    this.paymentChoice = ev.detail.value;
    if(ev.detail.value == "Nequi"){
      this.paymentChoice = this.paymentChoice + " (Recomendado)"
    }
    console.log(this.paymentChoice);
  }

  

}
