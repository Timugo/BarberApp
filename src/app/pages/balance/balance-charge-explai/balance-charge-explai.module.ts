import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BalanceChargeExplaiPageRoutingModule } from './balance-charge-explai-routing.module';

import { BalanceChargeExplaiPage } from './balance-charge-explai.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BalanceChargeExplaiPageRoutingModule
  ],
  declarations: [BalanceChargeExplaiPage]
})
export class BalanceChargeExplaiPageModule {}
