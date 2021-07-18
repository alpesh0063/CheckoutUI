import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from './Model/Product';
import { User } from './Model/User';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  promoCode: string="";
  orderProduct:Product[]=[];
  waitList:Product[]=[];
  userArray: User[]=[];
  constructor(private http: HttpClient) { }
  getProducts() {
        return this.http.get<any>('assets/products.json')
        .toPromise()
        .then(res => <Product[]>res.data)
        .then(data => { return data; });
    }
    getPromoCodes() {
      return this.http.get<any>('assets/promo-code.json')
      .toPromise()
      .then(res => <any[]>res.data)
      .then(data => { return data; });
  }
    saveProducts(products:Product[],waitList:Product[],promoCode:string){
      //ideally it should push the changes to backend so that we can use it for incomplete order
      //but since curently we dont have backend I will be using this service to save data
      this.orderProduct=products;
      this.waitList=waitList;
      this.promoCode=promoCode;
    }
    getProductOrder(){
      //ideally it should push the changes to backend so that we can use it for incomplete order
      //but since curently we dont have backend I will be using this service to save data
      return this.orderProduct;
    }
    getWaitList(){
      return this.waitList;
    }
    getPromo()
    {
      return this.promoCode;
    }
    calculateTotal(products:Product[]){
      let subTotal=0;
      products.forEach(element => {
        if(element.type=='donation')
        {
          subTotal=subTotal+element.price;
        }
        if(element.quantity>0)
        {
          subTotal=subTotal+element.quantity*element.price;
        }      
      });
      return subTotal;
    }
    calculateTax(products:Product[]){
      let taxTotal=0;
      products.forEach(element => {
        if(element.type=='donation')
        {
          taxTotal=taxTotal+element.price*element.taxPercentage/100;
        }
        if(element.quantity>0)
        {
          taxTotal=taxTotal+element.quantity*element.price*element.taxPercentage/100;
        }      
      });
      return taxTotal;
    }
    

}
