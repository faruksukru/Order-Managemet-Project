import { LightningElement, api, track, wire } from 'lwc';
//call Apex class to get Product detail info and similar Products 
import getProductRecord from '@salesforce/apex/ProductDetailsController.getProductDetails';
import getSimilarProducts from '@salesforce/apex/ProductDetailsController.getSimilarProduct';
//call Apex class to create cart item
import createCartItems from '@salesforce/apex/ProductDetailsController.createCartItem';
//import ShowToastEvent. This is standart, copy/paste
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class ProductDetails extends LightningElement {
//Variables  
@api recordId;// for publically used to store recordId of detail Product
@track product=[];
quantity=1;//used for Quantity increase or decrease to show on UI
totalPage;//keep how many pages do we have in pagination 
lengthVisible;//boolean to be used if we have any smilar product or not
totalRecords;//keep number of similar products
recordSize=3;//assign 3 to show 3 products in one page, can be changed
currentPage=1;//initial of the current page in pagination
visibleRecords;//keep similar products to be showed in each pagination page

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
if(event.target.value<this.quantity){//looks if chosen quantity more than inventory. 
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
createCartItems({productId: this.recordId, quantity: this.quantity})
.then(result=>{
    //if created show succes message
    const toastEvent = new ShowToastEvent({
        title: "Nice!",
        message: "Item Has Been Added to Cart",
        variant: "success"
        });
        this.dispatchEvent(toastEvent);//This standart
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

}