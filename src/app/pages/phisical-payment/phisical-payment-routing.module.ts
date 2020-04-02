import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PhisicalPaymentPage } from './phisical-payment.page';

const routes: Routes = [
  {
    path: '',
    component: PhisicalPaymentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PhisicalPaymentPageRoutingModule {}
