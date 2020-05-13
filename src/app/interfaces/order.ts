export interface OrderHistory {
    id: number,
    status: string,
    nameClient: string,
    address: string,
    newAddress : NewAddres,
    dateBegin:string,
    duration : number,
    price : number,
    phoneClient : number,
    services : [Service];
};
interface NewAddres {
    address : string,
    description : string,
    lat : string,
    lng : string
}
interface Service {
    nameService : string;
    typeService : string;
    quantity : number;
    price : number;
};