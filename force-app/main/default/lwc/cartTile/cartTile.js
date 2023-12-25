import { LightningElement, api, track, wire } from 'lwc';
import getcartItems from '@salesforce/apex/ProductDetailsController.getCartItems';
import deleteCartItem from '@salesforce/apex/ProductDetailsController.deleteCartItem';
import getAllCartProducts from '@salesforce/apex/ProductCategoriesController.getAllProduct';
//import ShowToastEvent. This is standart, copy/paste 
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class CartTile extends LightningElement {

    @api recordId;
    productIds =[];
    @track allCartItems=[];
    allProducts=[];
    isShowModal = false;//initial value not to show modal
    quantity;
    cartTotalAmount=0;

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

    //increase by 1 quantity to show on UI in -+ add button
handleIncrement(event) {
    this.quantity =event.target.value;
    this.quantity++;
    }
    
    //decrease by 1 quantity to show on UI in -+ add button
    handleDecrement(event) {
    this.quantity =event.target.value;
    if (this.quantity > 1) {
    this.quantity--;
    }}

    //when clicked add to cart button, calls imperative method and apex method to create cart item, and shows error or success toast message.
handleDelete(){
    this.isShowModal = true;//make modal visible
}

hideModalBox() {  
    this.isShowModal = false;
}

deleteCartItem(event) {
    /* imperative method to call apex controller to create cart item. 
    send productid and quantity. HERE WE HAVE TO SENT USER CARTID*/
    
    deleteCartItem({cartItemId: event.target.value})
    .then(result=>{
        

        //if created show succes message
        const toastEvent = new ShowToastEvent({
            title: "Succes!",
            message: "Item Has Been Deleted From Your Cart",
            variant: "success"
            });
            this.dispatchEvent(toastEvent);//This standart
            this.isShowModal = false;//make modal visible
            //refreshApex(this.cartItems);
        })
        .catch(error=>{
            
        });
}

get totalAmount(){
    this.cartTotalAmount=0;
    this.allCartItems.forEach(element => {
        this.cartTotalAmount+=element.TotalAmount__c;
        console.log('Amount'+this.cartTotalAmount);
         });
         return this.cartTotalAmount;

}
  

}