import { Component, OnInit } from '@angular/core';
import { Componente } from 'src/app/interfaces/barber';
import { UiServiceService } from 'src/app/services/ui-service.service';

import { Observable } from 'rxjs';
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  componentes : Observable<Componente[]>;
  nameBarber : string ="Barber";
  constructor(private dataService : UiServiceService) { }

  ngOnInit() {
    this.componentes = this.dataService.getMenuOpts();
    this.getBarber2(); 
  }
  async getBarber2() {
    const ret = await Storage.get({ key: 'barber' });
    const user = JSON.parse(ret.value);
    this.nameBarber =user.name;
  }

}
