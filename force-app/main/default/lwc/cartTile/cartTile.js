import { LightningElement, api, wire } from 'lwc';
import getcartItems from '@salesforce/apex/ProductDetailsController.getCardItems';
export default class CartTile extends LightningElement {

    @api recordId;
    productId;
allCartItems=[];

    @wire(getcartItems, { cartId: '$recordId'}) 
    cartItems({data,error}){ // created a function, function name can be anything
    if(data){ //if we retrieve  data
    this.allCartItems = data;//assign all similar products to totalRecords
    this.productId=data.product__c;
    }else if(error){//if we retrieve  data
        alert('There is an Error')
    this.allCartItems=undefined;
    }};

}