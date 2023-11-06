import { LightningElement, api, track, wire } from 'lwc';
import getAllCategoriesLocal from '@salesforce/apex/ProductCategoriesController.getAllCategories';

export default class ProductCategories extends LightningElement {
    @track allCategories=[];
    @track parentCategories=[];
    @track subCategories1=[];
    @track subCategories2=[];
    @track categoryId=[];
    @track categoryIds=[];
    @api subCat1;
    @api subCat2;
    @api selectedParentCategory; 
    @api selectedSubCategory1;
    @api selectedSubCategory2; 
    @track selectedCategory =[];
    @wire(getAllCategoriesLocal)
    wiredData({error, data}){
        if(data){//check the condition
            let option = [];
            let options = [];
            data.forEach(element => {
            options.push({label: element.Name, value: element.Id, parentCategoryId:element.ParentCategory__c});
            if(element.ParentCategory__c==null){
            option.push({label: element.Name, value: element.Id, parentCategoryId:element.ParentCategory__c});
            //this.subCat1=false;
           // this.subCat2=false;
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
        this.subCat1=false;
        this.subCat2=false;
        this.categoryIds=[];
        this.categoryId=[];
        this.allCategories.forEach(element => {
            if(element.parentCategoryId==this.selectedParentCategory){
            this.subCat1=true;
            options.push({label: element.label, value: element.value, parentCategoryId:element.parentCategoryId});
            this.categoryId.push (element.value);
            }});
            this.categoryId.forEach(element => {
                this.allCategories.forEach(elements => {
                    if(elements.parentCategoryId==element){
                   this.categoryIds.push (elements.value);
                    }})});

        this.subCategories1 = options;
        this.selectedSubCategory1=null;
        this.selectedSubCategory2=null; 
        } 

        handleSubCategory1Change(event) {
            this.selectedSubCategory1=event.detail.value;
                    let options = [];
                    this.subCat2=false
                    this.categoryIds=[];
                    this.allCategories.forEach(element => {
                      if(element.parentCategoryId==this.selectedSubCategory1){
                        this.subCat2=true;
                        options.push({label: element.label, value: element.value, parentCategoryId:element.parentCategoryId});
                        this.categoryIds.push (element.value);
                         }});
                    this.subCategories2 = options; 
                    this.selectedSubCategory2=null;
                   
                    
                                } 
                                handleSubCategory2Change(event) {
                                   // this.subCat2=true;
                                this.selectedSubCategory2=event.detail.value;
                                }
                    handleFilterClick(){
                        if(this.selectedSubCategory2!=null){
                            this.selectedCategory= this.selectedSubCategory2;
                           } else if(this.selectedSubCategory1!=null && this.selectedSubCategory2==null){
                            this.selectedCategory= this.categoryIds;
                        } else if(this.selectedSubCategory1==null && this.selectedSubCategory2==null) {
                            this.selectedCategory= this.categoryIds;
                                                        }
                                            }          
}