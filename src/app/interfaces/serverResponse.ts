import { OrderHistory } from "./order";
export interface Response {
    response: number;
    content: {
        message :string,
        description : string,
        codeQR:string
    }

}
export interface GenericResponse {
    response : number,
    content :{
        message : string
    }
}
export interface GetCurrentOrderResponse {
    response : number,
    content : {
        barber : any,
        order : OrderHistory
    }
}
export interface ResponseOrderHistory {
    response : number;
    content : [OrderHistory]
}