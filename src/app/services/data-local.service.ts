import { Barber } from './../interfaces/barber';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class DataLocalService {

  barbero: Barber;

  constructor(private storage: Storage) {
    this.cargarInfoBarber();
  }

  guardarInfoBarbero(barbero: Barber){
    this.storage.set('barbero', barbero);
  }

  async cargarInfoBarber(){
    const barbero = await this.storage.get('barbero');

    this.barbero = barbero;
  }

}
