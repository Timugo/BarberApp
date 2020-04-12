import { OrderHistory } from "./order";
export interface Response {
    response: number;
    content: {
        message :string,
        description : string,
        codeQR:string
    }

}

export interface ResponseOrderHistory {
    response : number;
    content : [OrderHistory]
}