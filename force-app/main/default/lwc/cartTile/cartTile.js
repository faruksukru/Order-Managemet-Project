import { LightningElement, api, track, wire } from 'lwc';
//Call apex controller to get cart items, delete and update choosen cart item  
import getcartItems from '@salesforce/apex/ProductDetailsController.getCartItems';
import deleteCartItem from '@salesforce/apex/ProductDetailsController.deleteCartItem';
import changeQuantity from '@salesforce/apex/ProductDetailsController.changeQuantity';
//import getAllCartProducts from '@salesforce/apex/ProductCategoriesController.getAllProduct';//NOT USED NOW
// to import refreshApex
import {refreshApex} from '@salesforce/apex';
//import ShowToastEvent. This is standart, copy/paste 
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class CartTile extends LightningElement {

//Variables
@api recordId;//cart id to show all related cart items
@track allCartItems=[];// keep all cartitems related with cart
@track dataResult =[];//get the result of query
@track isShowModal = false;//initial value not to show modal
quantity;//to assign value of quantity in cart item
cartTotalAmount=0;//to assign total amount of cart
deletedCartItem;//cartitem id which will be deleted, when click the delete icon
deletedCartItemInfo =[];//cartitem info which will be deleted, when click the delete icon
isLoaded=false;//make spinner unvisible initially
//productIds =[]; not used now
//allProducts=[];not used now


//send cart id and get all related cart items and assign allCartItems array which used in HTML
@wire(getcartItems, { cartId: '$recordId'}) 
cartItems(result){ // created a function, function name can be anything
this.dataResult=result;
console.log('Test1'+ JSON.stringify(this.dataResult));    
if(result.data){ //if we retrieve  data
this.allCartItems = result.data;//assign all similar products to totalRecords
/* this parts gets realted product ids used in below wire, but NOT USED NOW, 
because we get all needed info from cart item query.
data.forEach(element => {
this.productIds.push(element.Product__c);
});*/
console.log('Test2'+ JSON.stringify(this.allCartItems));
}else if(result.error){//if we retrieve  data
alert('There is an Error')
this.allCartItems=undefined;
}};
/* this part gets all products related with cart items, but NOT USED NOW, 
because we get all needed info from cart item query.
@wire(getAllCartProducts, { productIds: '$productIds'}) 
allProduct ({data,error}){ // created a function, function name can be anything
if(data){ //if we retrieve  data
this.allProducts = data;//assign all similar products to totalRecords
console.log('Test'+ JSON.stringify(this.allProducts));
}else if(error){//if we retrieve  data
alert('There is an Error')
this.allProducts=undefined;
}};*/

//increase cart item quantity by 1, call apex to update quantity in cart item and refresh page
handleIncrement(event) {
this.quantity =event.target.name.Quantity__c;
this.quantity++;
console.log('remaining'+event.target.name.Product__r.RemainingQuantity__c)
if(event.target.name.Product__r.RemainingQuantity__c<this.quantity){//looks if chosen quantity more than inventory. 
//to show error message if chosen quantity exceeds remaning quantity
const toastEvent = new ShowToastEvent({
title: "Oops",
message: "Quantity You Want to Add Exceed Our Inventory. You Can Add Maximum "+event.target.name.Product__r.RemainingQuantity__c+" for This Item",
variant: "Error"
});
this.dispatchEvent(toastEvent);
} else {
this.isLoaded=!this.isLoaded;//this make spinner work 
//call apex class to update cartitem sending cartitem id and new quantity
changeQuantity({cartItemId: event.target.value, cartItemQuantity:this.quantity})
.then(result=>{
refreshApex(this.dataResult);//this call apex and refresh data
this.isLoaded=!this.isLoaded;//this make spinner unvisible
//window.location.reload();//this reload page, but NOT USED NOW
})
.catch(error=>{
alert('There is an Error')    
});
}
}

//decrease cart item quantity by 1, call apex to update quantity in cart item and refresh page
handleDecrement(event) {
this.quantity =event.target.name;
if (this.quantity > 1) {
this.quantity--;
this.isLoaded=!this.isLoaded;//this make spinner work
//call apex class to update cartitem sending cartitem id and new quantity
changeQuantity({cartItemId: event.target.value, cartItemQuantity:this.quantity})
.then(result=>{
refreshApex(this.dataResult);//this call apex and refresh data
this.isLoaded=!this.isLoaded;//this make spinner unvisible
})
.catch(error=>{
alert('There is an Error')    
});
}}

/*when clicked delete button in cart detail, shows modal to ask to delete, assign cart item id  
and deleted cart item info which used in modal.*/
handleDelete(event){
this.isShowModal = true;//make modal visible
this.deletedCartItem=event.target.value;//assign cart item id
this.deletedCartItemInfo=[];//clear array initially
//for each and find related cart item record looking with id
this.allCartItems.forEach(element => {
if(element.Id === event.target.value){
this.deletedCartItemInfo.push(element);//put realted cart item info into this array
}
console.log('deleted cart item'+ JSON.stringify(this.deletedCartItemInfo));
});
}

//when clicked cancel button in modal it close modal
hideModalBox() {  
this.isShowModal = false;
}

/* when clicked delete button in modal, calls apex to delete cart items sendin cart item id, 
shows toast message and refresh page.*/
deleteCartItem(event) {
/* imperative method to call apex controller to create cart item. 
send productid and quantity. HERE WE HAVE TO SENT USER CARTID*/
this.isLoaded=!this.isLoaded;//this make spinner work
deleteCartItem({cartItemId: this.deletedCartItem})
.then(result=>{
//if created show succes message
const toastEvent = new ShowToastEvent({
title: "Succes!",
message: "Item Has Been Deleted From Your Cart",
variant: "success"
});
this.dispatchEvent(toastEvent);//This standart
this.isShowModal = false;//make modal unvisible
refreshApex(this.dataResult);//this call apex and refresh data
this.isLoaded=!this.isLoaded;//this make spinner unvisible
})
.catch(error=>{
alert('There is an Error');
});
}

//getter used total amount of the cart is calculated and send to HTML 
get totalAmount(){
this.cartTotalAmount=0;
this.allCartItems.forEach(element => {
this.cartTotalAmount+=element.TotalAmount__c;
});
return this.cartTotalAmount;
}
continueShopping(){

}

completeShopping(){

}
}