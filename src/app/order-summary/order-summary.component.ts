import { Product } from './../Model/Product'
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.css']
})
export class OrderSummaryComponent implements OnInit {
  @Input() orderDetails: Product[]=[];
  @Input() model:any;
  @Input() isEditable:boolean=false;
  @Input() buttonHeader:string="";
  edit:boolean=false;
  constructor() { }
  
  ngOnInit(): void {
    
  }
  ngOnChanges():void{
    
  }

}
