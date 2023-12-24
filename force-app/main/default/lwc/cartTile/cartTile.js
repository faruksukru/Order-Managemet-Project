import { LightningElement, api, wire } from 'lwc';
import getcartItems from '@salesforce/apex/ProductDetailsController.getCartItems';
import getAllCartProducts from '@salesforce/apex/ProductCategoriesController.getAllProduct';
export default class CartTile extends LightningElement {

    @api recordId;
    productIds =[];
    allCartItems=[];
    allProducts=[];


    @wire(getcartItems, { cartId: '$recordId'}) 
    cartItems({data,error}){ // created a function, function name can be anything
    if(data){ //if we retrieve  data
    this.allCartItems = data;//assign all similar products to totalRecords
    data.forEach(element => {
        this.productIds.push(element.Product__c);
    });
    console.log('Test'+ JSON.stringify(this.allCartItems));
    }else if(error){//if we retrieve  data
        alert('There is an Error')
    this.allCartItems=undefined;
    }};

@wire(getAllCartProducts, { productIds: '$productIds'}) 
allProduct ({data,error}){ // created a function, function name can be anything
    if(data){ //if we retrieve  data
    this.allProducts = data;//assign all similar products to totalRecords
        console.log('Test'+ JSON.stringify(this.allProducts));
    }else if(error){//if we retrieve  data
        alert('There is an Error')
    this.allProducts=undefined;
    }};

    relatedImage(){

    }

}