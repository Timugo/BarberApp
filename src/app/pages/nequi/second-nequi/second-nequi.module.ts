import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SecondNequiPageRoutingModule } from './second-nequi-routing.module';

import { SecondNequiPage } from './second-nequi.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SecondNequiPageRoutingModule
  ],
  declarations: [SecondNequiPage]
})
export class SecondNequiPageModule {}
