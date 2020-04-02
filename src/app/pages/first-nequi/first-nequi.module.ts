import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FirstNequiPageRoutingModule } from './first-nequi-routing.module';

import { FirstNequiPage } from './first-nequi.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FirstNequiPageRoutingModule
  ],
  declarations: [FirstNequiPage]
})
export class FirstNequiPageModule {}
