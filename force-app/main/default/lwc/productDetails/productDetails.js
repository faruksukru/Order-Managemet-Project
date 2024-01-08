import { LightningElement, api, track, wire } from 'lwc';
//call Apex class to get Product detail info and similar Products 
import getProductRecord from '@salesforce/apex/ProductDetailsController.getProductDetails';
import getSimilarProducts from '@salesforce/apex/ProductDetailsController.getSimilarProduct';
//call Apex class to create cart item
import createCartItems from '@salesforce/apex/ProductDetailsController.createCartItem';
//Call apex controller to get cart items  
import getcartItems from '@salesforce/apex/ProductDetailsController.getCartItems';
//import NavigationMixin. This is standart, copy/paste
import {NavigationMixin} from 'lightning/navigation';
//import ShowToastEvent. This is standart, copy/paste
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// to import refreshApex
import {refreshApex} from '@salesforce/apex';
export default class ProductDetails extends NavigationMixin(LightningElement) {
//Variables  
@api recordId;// for publically used to store recordId of detail Product
@track product=[];//IS NOT USED NOW
quantity=1;//used for Quantity increase or decrease to show on UI
totalPage;//keep how many pages do we have in pagination 
lengthVisible;//boolean to be used if we have any smilar product or not
totalRecords;//keep number of similar products
recordSize=3;//assign 3 to show 3 products in one page, can be changed
currentPage=1;//initial of the current page in pagination
visibleRecords;//keep similar products to be showed in each pagination page
isShowModal = false;//initial value not to show modal
cartId ='a09Do0000049mtTIAQ';//this is hard code, CHANGE WITH USER CART ID
sameItem=false;//initial value for sameItem check
newItem=false;//used in modal in HTML to show only modal format if new item added to cart
inCart=false;//used in modal in HTML to show only modal format if item has been added to cart
@track label=null;//used in modal in HTML to show which heading is used in modal
@track allCartItems=[];// keep all cartitems related with cart
@track dataResult =[];//get the result of query

// wire with apex class with sending recordId and getting product details 
@wire(getProductRecord, { productId: '$recordId'}) eachProduct;
// wire with apex class with sending recordId and getting similar products 
@wire(getSimilarProducts, { productId: '$recordId'}) 
similarProducts({data,error}){ // created a function, function name can be anything
if(data){ //if we retrieve  data
this.totalRecords = data;//assign all similar products to totalRecords
this.totalPage = Math.ceil(data.length/this.recordSize);//find how many pages to show on pagination
this.remaningQuantity=data.RemainingQuantity__c;
this.passRecord();//call function to assign three products to visibleRecords send to HTML to show on UI
}else if(error){//if we retrieve  data
this.totalRecords=undefined;
}};

//send cart id and get all related cart items and assign allCartItems array which used in HTML. This used to check if the added product in cart already.
@wire(getcartItems, { cartId: '$cartId'}) 
cartItems(result){ // created a function, function name can be anything
this.dataResult=result;
if(result.data){ //if we retrieve  data
this.allCartItems = result.data;//assign all similar products to totalRecords
console.log('Test2'+ JSON.stringify(this.allCartItems));
}else if(result.error){//if we retrieve  data
alert('There is an Error')
this.allCartItems=undefined;
}};

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

//decrease by 1 currentpage value and call function to show previous three products
handlePrevious(){
if(this.currentPage>1){//if the current page is 1, not work, no need to go back
this.currentPage=this.currentPage-1;
this.passRecord();
}}

//increase by 1 currentpage value and call function to show previous three products
handleNext(){
if(this.currentPage<this.totalPage){//if the current page greater than totalPage, not work, no need to go next
this.currentPage=this.currentPage+1;
this.passRecord();
}}

//slice similar products into three parts and assign to visibleRecords to send HTML
passRecord(){
const start = (this.currentPage-1)*this.recordSize;//calculate starting index for slice
const end = this.currentPage*this.recordSize;//calculate ending index for slice
this.visibleRecords =this.totalRecords.slice(start,end);//slice products and assign to visibleRecords to send HTML
if(this.visibleRecords.length>0){//assign boolean value if we have any records to send HTML
this.lengthVisible=true;
} else {
this.lengthVisible=false; 
}}

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
this.remaningQuantity = this.remaningQuantity- parseInt(event.target.value);
}

//when clicked add to cart button, calls imperative method and apex method to create cart item, and shows error or success toast message.
handleClick(event){
this.label=null;//initial value of modal aria-labelledby
//looks if cart item is added before 
this.allCartItems.forEach(element => {
if(element.Product__c == event.target.value.Id){
this.label='modal-heading-02';//make modal aria-labelledby to show related heading
this.inCart=true;//to show related items in modal, if the item has been added before
this.newItem=false;//not to show other related items in modal
this.sameItem=true;//make sameItem true not to continue below part
this.isShowModal = true;//make modal visible
}});
//looks if it is not added before into cart
if(!this.sameItem){
if(event.target.value.RemainingQuantity__c<this.quantity){//looks if chosen quantity more than inventory. 
//to show error message if chosen quantity exceeds remaning quantity
const toastEvent = new ShowToastEvent({
title: "Oops",
message: "Quantity You Want to Add Exceed Our Inventory. You Can Add Maximum "+event.target.value.RemainingQuantity__c+" for This Item",
variant: "Error"
});
this.dispatchEvent(toastEvent);
} else {//Else part if chosen quantity not more than inventory
/* imperative method to call apex controller to create cart item. 
send productid and quantity. HERE WE HAVE TO SENT USER CARTID*/
this.label='modal-heading-01';//make modal aria-labelledby to show related heading
this.newItem=true;//to show related items in modal, if the item is newly added
this.inCart=false;//not to show other related items in modal
createCartItems({productId: this.recordId, quantity: this.quantity})
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

}}}
//when click continue shopping close lightning modal
hideModalBox() {
refreshApex(this.dataResult);//this call apex and refresh data
this.isShowModal = false; 
}

}