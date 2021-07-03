import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service';
import { Product } from '../Model/Product';
import { User } from '../Model/USer';
import { UserProductView } from '../Model/UserProductView';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  taxPercentage:number=0.18;
  subTotal: number=0;
  taxTotal: number=0;
  total: number=0;
  products: Product[]=[];
  userProductArray: UserProductView[]=[];
  model:any=this;
  countries:string[]=[];
  isChange:boolean=true;
  constructor(private cartService:CartService) { }

  ngOnInit(): void {
    this.products=this.cartService.getProductOrder();
    this.userProductArray=[];
    this.onChange(null,0);
    let i;
    // this.products.forEach((element,index)=>{
    //   if(element.type=='ticket'){
    //   for(i=0;i<element.quantity;i++)
    //   this.userProductArray.push({product:element,user:{}})
    //   }
    // });


    // this.cartService.getProducts().then(data => {
    //   this.products = data;
    //   this.userProductArray=[];
    //   let i;
    //   this.products.forEach((element,index)=>{
    //     for(i=0;i<element.quantity;i++)
    //     this.userProductArray.push({product:element,user:{}})
    //   });
    // });

    this.countries=['India','USA'];
  }
  reDirecttoSubmitPage()
  {
    console.log(this.userProductArray);
  }
  onSubmit()
  {
    
  }
  onChange(event:any,id:any)
  {
    //we can also add logic to splice
    this.userProductArray=[];
    this.subTotal=0;
    let i=0;
    this.subTotal=this.cartService.calculateTotal(this.products);
    this.taxTotal=this.cartService.calculateTax(this.products);
    this.total=this.subTotal+this.taxTotal;
    this.products.forEach((element,index)=>{
      for(i=0;i<element.quantity;i++)
      this.userProductArray.push({product:element,user:{}})
    });

    // this.userProductArray.forEach((element,index) => {
    //   if(element.product.id==id)
    //   {
    //     if(this.userProductArray[index].product.quantity>event)
    //     this.userProductArray.splice(index,this.products.)
    //   }      
    // });

  }
}
