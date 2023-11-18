import { LightningElement, api, track } from 'lwc';
export default class ProductCategoriesChild extends LightningElement {
@api eachprod;
@api inStock=false;
@api quantity=1;
@api remaningQuantity;

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

}