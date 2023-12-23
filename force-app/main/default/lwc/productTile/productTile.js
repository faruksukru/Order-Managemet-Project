import { LightningElement, api, track } from 'lwc';
//import NavigationMixin. This is standart, copy/paste
import {NavigationMixin} from 'lightning/navigation';
//import ShowToastEvent. This is standart, copy/paste 
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
//call Apex class to create cart item
import createCartItems from '@salesforce/apex/ProductDetailsController.createCartItem';
export default class ProductTile extends NavigationMixin(LightningElement) {
//Variables
@api eachprod;//product publically available comes from parent
@api recordId;//recordId publically available comes from parent
recId;
cartId ='a09Do0000049mtTIAQ';
inStock=false;//initial value to used in HTML if have any stock or not
quantity=1;//used for Quantity increase or decrease to show on UI
remaningQuantity;//keep remaining quantiy used in get function 
isShowModal = false;//initial value not to show modal

//Navigationmixin function to show product in detail page. below part is standart, copy/paste.
navigateToViewProduct(event) {
//var recId = event.target.name;
this.recId = event.target.name;
this[NavigationMixin.Navigate]({
type: 'standard__recordPage',
attributes: {
recordId: this.recId,
objectApiName: 'Product2',
actionName: 'view'
}
});}
//Navigationmixin function to cart page. below part is standart, copy/paste.
navigateToCart(event) {
    //var recId = event.target.name;
    //this.recId = event.target.name;
    this[NavigationMixin.Navigate]({
    type: 'standard__recordPage',
    attributes: {
    recordId: this.cartId,
    objectApiName: 'Cart__c',
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

//when clicked add to cart button, calls imperative method and apex method to create cart item, and shows error or success toast message.
handleClick(event){
    if(event.target.value.RemainingQuantity__c<this.quantity){//looks if chosen quantity more than inventory. 
    //to show error message if chosen quantity exceeds remaning quantity
    const toastEvent = new ShowToastEvent({
    title: "Oops",
    message: "Quantity You Want to Add Exceed Our Inventory. You Can Add Maximum "+event.target.value+" for This Item",
    variant: "Error"
    });
    this.dispatchEvent(toastEvent);
    } else {//Else part if chosen quantity not more than inventory
    /* imperative method to call apex controller to create cart item. 
    send productid and quantity. HERE WE HAVE TO SENT USER CARTID*/
    createCartItems({productId: this.eachprod.Id, quantity: this.quantity})
    .then(result=>{
        //if created show succes message
        const toastEvent = new ShowToastEvent({
            title: "Nice!",
            message: "Item Has Been Added to Cart",
            variant: "success"
            });
            this.dispatchEvent(toastEvent);//This standart
            this.isShowModal = true;//make modal visible
        })
        .catch(error=>{
            //if not created show error message
                const toastEvent = new ShowToastEvent({
                title: "Oops!",
                message: "Item Has not Been Added to Cart. Please Try Again ",
                variant: "error"
                });
                this.dispatchEvent(toastEvent);//This standart
        });
    }}
//when click continue shopping close lightning modal
    hideModalBox() {  
        this.isShowModal = false;
    }
    

}