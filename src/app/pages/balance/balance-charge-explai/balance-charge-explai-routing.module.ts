import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BalanceChargeExplaiPage } from './balance-charge-explai.page';

const routes: Routes = [
  {
    path: '',
    component: BalanceChargeExplaiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BalanceChargeExplaiPageRoutingModule {}
