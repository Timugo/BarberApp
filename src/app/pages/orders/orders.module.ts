import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrdersPageRoutingModule } from './orders-routing.module';

import { OrdersPage } from './orders.page';
import { ComponentsModule } from '../../components/components.module';
import { SlideDrawerComponent } from 'src/app/components/slide-drawer/slide-drawer.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrdersPageRoutingModule,
    ComponentsModule,
    SlideDrawerComponent
  ],
  declarations: [OrdersPage]
})
export class OrdersPageModule {}
