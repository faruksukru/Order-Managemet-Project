import { LightningElement, track, wire } from 'lwc';
import getAllCategoriesLocal from '@salesforce/apex/ProductCategoriesController.getAllCategories';

export default class ProductCategories extends LightningElement {
    @track allCategories=[];
    @track parentCategories=[];
    @track subCategories1=[];
    @track subCategories2=[];
    subCat1=false;
    subCat2=false;
    selectedParentCategory; 
    selectedSubCategory1; 
    @wire(getAllCategoriesLocal)
    wiredData({error, data}){
        if(data){//check the condition
            let option = [];
            let options = [];
        data.forEach(element => {
            options.push({label: element.Name, value: element.Id, parentCategoryId:element.ParentCategory__c});
            if(element.ParentCategory__c==null){
            option.push({label: element.Name, value: element.Id, parentCategoryId:element.ParentCategory__c});
            
        }});
        this.allCategories = options;     
        this.parentCategories = option; //assign values and labels into array. 
        console.log('Option is ' + JSON.stringify(this.parentCategories))
        }
        else if(error){
        console.log('Error is' + JSON.stringify(error))
        }
        
        } 

        handleParentCategoryChange(event) {
this.selectedParentCategory=event.detail.value;
        let options = [];
        this.allCategories.forEach(element => {
            
            if(element.parentCategoryId==this.selectedParentCategory){
            this.subCat1=true;
            options.push({label: element.label, value: element.value, parentCategoryId:element.parentCategoryId});
            
            
        }});
        this.subCategories1 = options; 

        } 
        handleSubCategory1Change(event) {
            this.selectedSubCategory1=event.detail.value;
                    let options = [];
                    this.allCategories.forEach(element => {
                        
                        if(element.parentCategoryId==this.selectedSubCategory1){
                        this.subCat2=true;
                        options.push({label: element.label, value: element.value, parentCategoryId:element.parentCategoryId});
                        
                        
                    }});
                    this.subCategories2 = options; 
            
                    } 
}