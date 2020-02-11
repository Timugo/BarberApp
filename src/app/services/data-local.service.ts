import { Barber } from './../interfaces/barber';
import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;
@Injectable({
  providedIn: 'root'
})
export class DataLocalService {

  barbero: Barber;
  codigo: number;

  constructor() {
  }

  async saveInfoBarber(barbero: Barber){
    await Storage.set({
      key: 'barber',
      value:JSON.stringify(barbero)
    });
  }
  async saveCity(city:string) {
    await Storage.set({
      key: 'city',
      value: city
    });
  }

  async getBarber() {
    const ret = await Storage.get({ key: 'barber' });
    const user = JSON.parse(ret.value);
  }

  
  
  async saveInfoCurrentOrder(idOrder : number) {
    await Storage.set({
      key: 'currentOrder',
      value: idOrder.toString()
    });
  }
    //this.storage.set('currentorder', codigo);
  

  

}
