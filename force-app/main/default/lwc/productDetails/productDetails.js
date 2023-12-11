import { LightningElement, api, track, wire } from 'lwc';
import getProductRecord from '@salesforce/apex/ProductDetailsController.getProductDetails';
import getSimilarProducts from '@salesforce/apex/ProductDetailsController.getSimilarProduct';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class ProductDetails extends LightningElement {
    @api recordId;
    @track product=[];
    @track prod;
    @api inStock=false;
    @api quantity=1;
    @api remaningQuantity;
    
  @wire(getProductRecord, { productId: '$recordId'}) eachProduct;
  @wire(getSimilarProducts, { productId: '$recordId'}) similarProducts;
  
    
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
    handleClick(event){
      const toastEvent = new ShowToastEvent({
        title: "Nice!",
        message: "Item Has Been Added to Cart",
        variant: "success"
        });
        this.dispatchEvent(toastEvent);
          }
}