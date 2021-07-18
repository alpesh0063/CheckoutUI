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
  promos: any[]=[];
  totalDiscount: number=0;
  discountPercentage: number=0;
  promoCode: string="";
  total: number=0;
  subTotal: number=0;
  products: Product[]=[];
  model:any=this;
  taxTotal:number=0;
  isChange:boolean=false;
  waitList:Product[]=[];
  orderError:string="";
  constructor(private productService: CartService,private router:Router) { }

  ngOnInit(): void {
    // this.numbers = Array.from(Array(10),(x,i)=>i+1);
    this.productService.getPromoCodes().then(promos=>{
      this.promos=promos;
    });
    this.productService.getProducts().then(data => {
      this.products = data;
      let temp;
      this.products.forEach(element => {
        temp=moment(element.saleEndDate, "YYYY-MM-DD").endOf('day').diff(moment(), 'days')
        if(temp>0)
        element.timePending=temp+ " days";
        else 
        element.timePending=(moment(element.saleEndDate, "YYYY-MM-DD").endOf('day').diff(moment(),"hours"))+" hours";
        if(element.type=='ticket'||element.type=='book')
        element.ticketMaxArray=Array.from(Array(Math.max(element.inventoryCount,10)),(x,i)=>i);
      });
    });
    
    
  }
  getColorForTimePening(temp:any)
  {
    if(temp.includes('hour'))
    return '#EB7092';
    else return '';
  }
  onChange(event:any,count:any)
  {
    if(this.products[count].type=='ticket' && this.products[count].isWaitlist)
    {
      if(this.products[count].quantity>this.products[count].inventoryCount)
      {
        this.waitList.forEach(element => {
          if(element.id==this.products[count].id)
          {
            element.quantity=this.products[count].quantity-this.products[count].inventoryCount;
          }
        });
      }
      else {
        this.products[count].isWaitlist=false;
        let idVal=this.products[count].id;
        this.waitList=this.waitList.filter(function(value, index, arr){ 
          return value.id != idVal
      });
      }
    }
    this.isChange=true;
    this.subTotal=0;
    this.taxTotal=0;
    this.subTotal=this.productService.calculateTotal(this.products);
    this.taxTotal=this.productService.calculateTax(this.products);
    // this.total=this.subTotal+this.taxTotal;
    
    if(this.promoCode!=undefined && this.promoCode!="")
    this.applyPromo(this.promoCode);
    else this.total=this.subTotal+this.taxTotal-this.totalDiscount;
  }
  addTicketToWaitlist(item:Product)
  {
    item.isWaitlist=true;
    let temp={...item};
    temp.quantity=item.quantity-item.inventoryCount;
    this.waitList.push(temp);
  }
  removeTicketToWaitlist(item:Product){
    this.waitList=this.waitList.filter(function(value, index, arr){ 
      return value.id != item.id
  });
  }
  reDirecttoSubmitPage(){
    this.orderError="";
    this.products.forEach(element => {
      if(element.quantity>element.inventoryCount && !element.isWaitlist)
      this.orderError="One or more ticket needs to be waitlisted in order to Checkout"
    });
    if(this.orderError!="")
      return;
    this.productService.saveProducts(this.products,this.waitList,this.promoCode);
    this.router.navigate(['checkout'])
  }
  applyPromo(promocode:string){
    this.discountPercentage=0;
    this.totalDiscount=0;
    this.promoCode=promocode;
      this.promos.forEach(promo => {
        if(promo.name==promocode)
        {
          this.discountPercentage=promo.discount;
        }
      });
      if(this.discountPercentage>0)
      {
        this.totalDiscount=this.subTotal*this.discountPercentage/100;
        this.total=this.subTotal+this.taxTotal-this.totalDiscount;
      }
  }
}
