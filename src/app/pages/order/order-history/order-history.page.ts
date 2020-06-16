import { Component, OnInit } from '@angular/core';
//services
import { OrdersService } from 'src/app/services/orders.service';
import { DataLocalService } from 'src/app/services/data-local.service';
import { UiServiceService } from 'src/app/services/ui-service.service';
//interfaces
import { OrderHistory } from 'src/app/pages/order/interfaces/order';
import { Barber } from 'src/app/interfaces/barber';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.page.html',
  styleUrls: ['./order-history.page.scss'],
})
export class OrderHistoryPage implements OnInit {
  //variables 
  orderHistory : OrderHistory[];
  
  
  constructor(
    //services
    private ordersService : OrdersService,
    private localDataService : DataLocalService,
    private allertsService : UiServiceService
  ) { }

  ngOnInit() {
    //fetch data from server
    this.getOrders();
  }
  //fetch history of orders
  async getOrders(){
    //fetch barber from local storage
    let barber:Barber = await this.localDataService.getBarber();
    this.ordersService.getOrdersHistory(parseInt(barber.phone)).subscribe((res)=>{
      //recent orders firsts
      if(res.response == 2){
        //if the arrary is not empty
        if(res.content.length){
          this.orderHistory = res.content.reverse();
          // console.log(this.orderHistory[0].address)
        }else{
          //array empty
          this.allertsService.showToast("Ups no tienes ordenes aun, vuelve mas tarde","primary",3000);
        }
      }else{
        //handle error
        this.allertsService.showToast("Ups algo salio mal de nuestro lado, intentalo mas tarde","danger",3000);
      }
    });
  }

}
