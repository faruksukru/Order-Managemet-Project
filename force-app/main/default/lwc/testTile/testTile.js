import { LightningElement, api, track } from 'lwc';
import {NavigationMixin} from 'lightning/navigation'; 
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class testTile extends NavigationMixin(LightningElement) {
@api eachprod;
@api inStock=false;
@api quantity=1;
@api remaningQuantity;
@api recordId;

navigateToViewProduct(event) {
    var recId = event.target.name;
    this[NavigationMixin.Navigate]({
        type: 'standard__recordPage',
            attributes: {
                recordId: recId,
                objectApiName: 'Product2',
                actionName: 'view'
    }
    });
}
    

get isInStock(){
this.remaningQuantity=this.eachprod.RemainingQuantity__c;
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
handleClick(event){
    if(this.eachprod.RemainingQuantity__c<this.quantity){
        const toastEvent = new ShowToastEvent({
            title: "Oops",
            message: "Quantity You Want to Add Exceed Our Inventory. You Can Add Maximum "+this.eachprod.RemainingQuantity__c+" for This Item",
            variant: "Error"
            });
            this.dispatchEvent(toastEvent);
    } else {
    const toastEvent = new ShowToastEvent({
      title: "Nice!",
      message: "Item Has Been Added to Cart",
      variant: "success"
      });
      this.dispatchEvent(toastEvent);
    }
  
}
}