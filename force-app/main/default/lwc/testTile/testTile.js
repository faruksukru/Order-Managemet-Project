import { LightningElement, api, track } from 'lwc';
import {NavigationMixin} from 'lightning/navigation'; 
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

}