import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PhisicalPaymentPageRoutingModule } from './phisical-payment-routing.module';

import { PhisicalPaymentPage } from './phisical-payment.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PhisicalPaymentPageRoutingModule
  ],
  declarations: [PhisicalPaymentPage]
})
export class PhisicalPaymentPageModule {}
