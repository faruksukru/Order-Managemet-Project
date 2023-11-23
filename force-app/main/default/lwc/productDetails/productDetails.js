import { LightningElement, api, track, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';

const FIELDS = ['Product2.Name', 'Product2.Description'];

export default class ProductDetails extends LightningElement {
    @api recordId;
    @track product=[];
    @api name;
  @api description;

    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    wiredProduct({ error, data }) {
        if (data) {
            this.product = {
                Name: data.fields.Name.value,
                Description: data.fields.Description.value,
                //Price__c: data.fields.Price__c.value,
                // Add other fields as needed
            };
        } else if (error) {
            console.error('Error retrieving product details:', error);
        }
    }
}