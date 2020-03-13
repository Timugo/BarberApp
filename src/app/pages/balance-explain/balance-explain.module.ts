import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BalanceExplainPageRoutingModule } from './balance-explain-routing.module';

import { BalanceExplainPage } from './balance-explain.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BalanceExplainPageRoutingModule
  ],
  declarations: [BalanceExplainPage]
})
export class BalanceExplainPageModule {}
