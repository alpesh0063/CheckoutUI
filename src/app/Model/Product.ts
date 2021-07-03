export interface Product {
    id?:string;
    name?:string;
    description?:string;
    saleEndDate?:Date;
    price:number;
    quantity?:any;
    type?:string;
    image?:string;
    inventoryCount:number;
    timePending?:string;
    ticketMaxArray?:number[];
    options?:number[];
    taxPercentage:number;
}