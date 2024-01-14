import { LightningElement, track, wire } from 'lwc';
import getAddress from '@salesforce/apex/ProductDetailsController.getAddress';
import addCustomerUser from '@salesforce/apex/ProductDetailsController.addCustomerId';
import deleteAddress from '@salesforce/apex/ProductDetailsController.deleteAddress';
// to import refreshApex
import {refreshApex} from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class AdressBook extends LightningElement {
customerUser='005Do000002EkvL';//this is hard code, CHANGE WITH CUSTOMER USER ID
newAddress=false;
@track allAddresses=[];// keep all cartitems related with cart
@track dataResult =[];//get the result of query

@wire(getAddress, {customerUserId: '$customerUser'}) 
allAddress(result){ // created a function, function name can be anything
this.dataResult=result;
if(result.data){ //if we retrieve  data
this.allAddresses = result.data;//assign all similar products to totalRecords
console.log('Test2'+ JSON.stringify(this.allAddresses));
}else if(result.error){//if we retrieve  data
alert('There is an Error')
this.allAddresses=undefined;
}};


//When creating address record, this assign user id to the record
handleSuccess(event) {
/*send newly created addressbook id,customer user id  and add this customer id to the adress book record.
We add this part, because we use ligthning reocrd edit form to create form, here we can not give user id so that, 
after cerating address book it adds user id calling apex*/
addCustomerUser({addressBookId: event.detail.id, customerUserId:this.customerUser})
.then(result=>{
const toastEvent = new ShowToastEvent({
    title: 'Succes!',
    message: 'New Address Has Been Created Succesfully!',
    variant: 'success',
    });
    this.dispatchEvent(toastEvent);
    this.newAddress=false;
    refreshApex(this.dataResult);//this call apex and refresh data
})
/*In this part if something goes wrong while adding user to adress book record
it deletes newly created addressbook and give error toast message.*/
.catch(error=>{
deleteAddress({addressBookId: event.detail.id})
.then(result=>{
const toastEvent = new ShowToastEvent({
    title: 'Oops!',
    message: 'We Have not Created Address. Please Try it Again!',
    variant: 'Error',
    });
    this.dispatchEvent(toastEvent);
})
.catch(error=>{
alert('There is an Error')    
});   
});
}

//NOT USED RIGHT NOW, IF ADDED ERROR PART FOR FORM USE THIS PART
/*handleError(event) {
const toastEvent = new ShowToastEvent({
title: 'Dublicate Record!',
message: 'We already have your record in our Database',
variant: 'error',
});
this.dispatchEvent(toastEvent);
} */

addAddress(){
this.newAddress=true;
}

}