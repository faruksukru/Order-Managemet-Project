import { LightningElement, api, track } from 'lwc';
//import NavigationMixin. This is standart, copy/paste
import {NavigationMixin} from 'lightning/navigation';
//import ShowToastEvent. This is standart, copy/paste 
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class ProductTile extends NavigationMixin(LightningElement) {
//Variables
@api eachprod;//product publically available comes from parent
@api recordId;//recordId publically available comes from parent
inStock=false;//initial value to used in HTML if have any stock or not
quantity=1;//used for Quantity increase or decrease to show on UI
remaningQuantity;//keep remaining quantiy used in get function 

//Navigationmixin function to show product in detail page. below part is standart, copy/paste.
navigateToViewProduct(event) {
var recId = event.target.name;
this[NavigationMixin.Navigate]({
type: 'standard__recordPage',
attributes: {
recordId: recId,
objectApiName: 'Product2',
actionName: 'view'
}
});}

// get function to decide instock or out of stock
get isInStock(){
this.remaningQuantity=this.eachprod.RemainingQuantity__c;
if(this.remaningQuantity>0){
this.inStock=true;
} 
return  this.inStock;
}

//increase by 1 quantity to show on UI in -+ add button
handleIncrement() {
this.quantity++;
}

//decrease by 1 quantity to show on UI in -+ add button
handleDecrement() {
if (this.quantity > 1) {
this.quantity--;
}}

//RIGHT NOW NOT USED
handleQuantityChange(event) {
//this.remaningQuantity=event.detail.value;
this.remaningQuantity = this.remaningQuantity- parseInt(event.target.value);
}

//when clicked add to cart button, shows error or success toast message.below most part is standart, copy/paste.
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
}}

}