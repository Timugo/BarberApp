export interface OrderHistory {
    id: number;
    status: string;
    nameClient: string;
    address: string;
    dateBegin:string;
    duration : number;
    price : number;
    services : [Service];
};
interface Service {
    nameService : string;
    typeService : string;
    quantity : number;
    price : number;
};