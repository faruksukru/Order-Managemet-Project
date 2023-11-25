import { LightningElement, api, track, wire } from 'lwc';
import getProductRecord from '@salesforce/apex/ProductDetailsController.getProductDetails';

export default class ProductDetails extends LightningElement {
    @api recordId;
    @track product=[];
    @track prod;
    @api inStock=false;
    @api quantity=1;
    @api remaningQuantity;
    
  @wire(getProductRecord, { productId: '$recordId'}) eachProduct;
 @api
  get isInStock(){
   this.remaningQuantity=this.prod.RemainingQuantity__c;
    if(this.remaningQuantity>0){
    this.inStock=true;
    } 
    return  this.inStock;
    }
    
    handleIncrement() {
    this.quantity++;
    //this.eachprod.RemainingQuantity__c=this.eachprod.RemainingQuantity__c-this.quantity;
    }
    
    handleDecrement() {
    if (this.quantity > 1) {
    this.quantity--;
    //this.eachprod.RemainingQuantity__c=this.eachprod.RemainingQuantity__c+this.quantity;
    }
    }
    
    handleQuantityChange(event) {
    //this.remaningQuantity=event.detail.value;
    this.remaningQuantity = this.remaningQuantity- parseInt(event.target.value);
    }
    
  
}