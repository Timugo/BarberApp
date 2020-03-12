import { Barber } from './../../interfaces/barber';
import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { AlertController, NavController, MenuController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Plugins } from '@capacitor/core';



const {StatusBar} = Plugins;



@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  mensaje: any;
  formLogin: FormGroup;
  barbero: Barber;
  activeMenu: string;
  disableButton :Boolean;
  constructor(private loginService: LoginService,
              private fb: FormBuilder,
              public alertController: AlertController,
              public menu: MenuController,
              ) { 
                this.menu1Active();
                this.hideStatusBar();
              }

  ngOnInit() {
    //run validators to the form - phone field
    this.formLogin = this.fb.group({
      phone: [null, Validators.compose([Validators.required, Validators.minLength(10)])]
    });
  }
  //this function its activated by login button in the html
  login(formLogin: FormGroup){
      this.loginService.login(formLogin.value.phone);
  } 
  //disable menu in the login page
  menu1Active() {
    this.activeMenu = 'first';
    this.menu.enable(false, this.activeMenu);
  }
  hideStatusBar() {
    StatusBar.hide();
  }
}
