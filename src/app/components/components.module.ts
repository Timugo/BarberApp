import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { IonicModule } from '@ionic/angular';
import { MenuComponent } from './menu/menu.component';
import { RouterModule } from '@angular/router';
import { SlideDrawerComponent } from './slide-drawer/slide-drawer.component';



@NgModule({
  declarations: [
    HeaderComponent,
    MenuComponent,
    SlideDrawerComponent
  ],
  exports: [
    HeaderComponent,
    MenuComponent,
    SlideDrawerComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule//without this the [router Link  Doesnt work in ionic items] 
  ]
})
export class ComponentsModule { }
