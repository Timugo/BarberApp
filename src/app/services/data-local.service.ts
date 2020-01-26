import { Barber } from './../interfaces/barber';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class DataLocalService {

  barbero: Barber;
  codigo: number;

  constructor(private storage: Storage) {
    this.cargarInfoBarber();
    this.cargarCurrentOrder();
  }

  guardarInfoBarbero(barbero: Barber){
    this.storage.set('barbero', barbero);
  }

  async cargarInfoBarber(){
    const barbero = await this.storage.get('barbero');

    this.barbero = barbero;
  }

  guardarInfoCurrentOrder(codigo: number){
    this.storage.set('currentorder', codigo);
  }

  async cargarCurrentOrder(){
    const id = await this.storage.get('currentorder');
    this.codigo = id;
  }

}
