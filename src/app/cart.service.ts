import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from './Model/Product';
import { User } from './Model/USer';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  orderProduct:Product[]=[];
  userArray: User[]=[];
  constructor(private http: HttpClient) { }
  getProducts() {
        return this.http.get<any>('assets/products.json')
        .toPromise()
        .then(res => <Product[]>res.data)
        .then(data => { return data; });
    }
    saveProducts(products:Product[]){
      //ideally it should push the changes to backend so that we can use it for incomplete order
      //but since curently we dont have backend I will be using this service to save data
      this.orderProduct=products;
    }
    getProductOrder(){
      //ideally it should push the changes to backend so that we can use it for incomplete order
      //but since curently we dont have backend I will be using this service to save data
      return this.orderProduct;
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
