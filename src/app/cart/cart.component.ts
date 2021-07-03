import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service';
import { Product } from '../Model/Product';

import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  total: number=0;
  subTotal: number=0;
  products: Product[]=[];
  model:any=this;
  taxTotal:number=0;
  isChange:boolean=false;
  constructor(private productService: CartService,private router:Router) { }

  ngOnInit(): void {
    // this.numbers = Array.from(Array(10),(x,i)=>i+1);
    this.productService.getProducts().then(data => {
      this.products = data;
      let temp;
      this.products.forEach(element => {
        temp=moment(element.saleEndDate, "YYYY-MM-DD").endOf('day').diff(moment(), 'days')
        if(temp>0)
        element.timePending=temp+ " days";
        else 
        element.timePending=(moment(element.saleEndDate, "YYYY-MM-DD").endOf('day').diff(moment(),"hours"))+" hours";
        element.ticketMaxArray=Array.from(Array(element.inventoryCount),(x,i)=>i);
      });
    });
    
    
  }
  getColorForTimePening(temp:any)
  {
    if(temp.includes('hour'))
    return '#EB7092';
    else return '';
  }
  onChange(event:any)
  {
    this.isChange=true;
    this.subTotal=0;
    this.taxTotal=0;
    this.subTotal=this.productService.calculateTotal(this.products);
    this.taxTotal=this.productService.calculateTax(this.products);
    this.total=this.subTotal+this.taxTotal;
  }
  reDirecttoSubmitPage(){
    this.productService.saveProducts(this.products);
    this.router.navigate(['checkout'])
  }
}
