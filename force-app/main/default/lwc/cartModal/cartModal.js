import { LightningElement, api } from 'lwc';
//import NavigationMixin. This is standart, copy/paste
import {NavigationMixin} from 'lightning/navigation';
export default class CartModal extends NavigationMixin(LightningElement) {

@api prodmodal;
cartId ='a09Do0000049mtTIAQ';
isShowModal = false;//initial value not to show modal
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

    hideModalBox() {  
        this.isShowModal = false;
    }

}