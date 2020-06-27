import { Barber } from './../interfaces/barber';
import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;
@Injectable({
  providedIn: 'root'
})
export class DataLocalService {

  constructor() {}

  async saveObject(key: string,object : any){
    await Storage.set({
      key,
      value:JSON.stringify(object)
    });
  }
  async saveCity(city:string) {
    await Storage.set({
      key: 'city',
      value: city
    });
  }
  //Save Payment QR code
  async saveInfoQr(codeQr: string){
    await Storage.set({
      key: 'codeQr',
      value:codeQr
    });
  
  }
  async getItem(item : string) {
    const { value } = await Storage.get({ key: item });
    return value;
  }
  
  async getBarber() {
    const ret = await Storage.get({ key: 'barber' });
    const user = JSON.parse(ret.value);
    return user;
  }

  async getObject(key:string) {
		const ret:any = await Storage.get({ key });
		const object = JSON.parse(ret.value);
		return object;
  }
  
  //delete an item from the local storage and return true of error
	async removeItem(key:string) {
		await Storage.remove({ key })
	}

  async saveInfoCurrentOrder(idOrder : number) {
    await Storage.set({
      key: 'currentOrder',
      value: idOrder.toString()
    });
  }
  async clearStorage(){
    return await Storage.clear();
  }
  

  

}
