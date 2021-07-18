import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service';
import { Product } from '../Model/Product';
import { User } from '../Model/User';
import { UserProductView } from '../Model/UserProductView';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  promos: any[]=[];
  totalDiscount: number=0;
  discountPercentage: number=0;
  promoCode: string="";
  taxPercentage:number=0.18;
  subTotal: number=0;
  taxTotal: number=0;
  total: number=0;
  products: Product[]=[];
  userProductArray: UserProductView[]=[];
  model:any=this;
  countries:string[]=[];
  isChange:boolean=true;
  waitList:Product[]=[];
  constructor(private cartService:CartService) { }

  ngOnInit(): void {
    this.products=this.cartService.getProductOrder();
    this.waitList=this.cartService.getWaitList();
    this.promoCode=this.cartService.getPromo();
    this.cartService.getPromoCodes().then(promos=>{
      this.promos=promos;
      this.onChange(null,0);
    })
    this.userProductArray=[];
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
    //we can also add logic to splice
    this.userProductArray=[];
    this.subTotal=0;
    let i=0;
    this.subTotal=this.cartService.calculateTotal(this.products);
    this.taxTotal=this.cartService.calculateTax(this.products);
    this.total=this.subTotal+this.taxTotal-this.totalDiscount;
    this.products.forEach((element,index)=>{
      for(i=0;i<element.quantity;i++)
      this.userProductArray.push({product:element,user:{}})
    });
    if(this.promoCode!=undefined && this.promoCode!="")
    this.applyPromo(this.promoCode);
    // this.userProductArray.forEach((element,index) => {
    //   if(element.product.id==id)
    //   {
    //     if(this.userProductArray[index].product.quantity>event)
    //     this.userProductArray.splice(index,this.products.)
    //   }      
    // });

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
