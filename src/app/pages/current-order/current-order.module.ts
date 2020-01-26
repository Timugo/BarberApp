import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CurrentOrderPageRoutingModule } from './current-order-routing.module';

import { CurrentOrderPage } from './current-order.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CurrentOrderPageRoutingModule,
    ComponentsModule,
    ReactiveFormsModule
  ],
  declarations: [CurrentOrderPage]
})
export class CurrentOrderPageModule {}
