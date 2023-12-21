//Get all categories from apex class, js divides each category. We have up to three categories under each other
import { LightningElement, api, track, wire } from 'lwc';
//call Apex class to get All categories and Products 
import getAllCategoriesLocal from '@salesforce/apex/ProductCategoriesController.getAllCategories';
import getAllProducts from '@salesforce/apex/ProductCategoriesController.getAllProduct';
export default class ProductCategories extends LightningElement {
//Variables    
allCategories=[];//keeps all categories comes from apex
parentCategories=[];//keeps only parent categories
subCategories1=[];//keeps only subcategory 1 categories
subCategories2=[];//keeps only subcategory 2  categories
categoryId=[];//keep all subcategory 1 ids
categoryIds=[];//keep all subcategory 2 ids
catIds=[];//keep allcategoryIds to send apex and get back related products
subCat1;//booalen to used to show second combobox
subCat2;//booalen to used to show third combobox
selectedParentCategory;//keep selected category in first combobox 
selectedSubCategory1;//keep selected category in second combobox 
selectedSubCategory2;//keep selected category in third combobox 


// wire with apex class getting all categories. Here we add all cotegories in one array and only parent categories in another array 
@wire(getAllCategoriesLocal)
wiredData({error, data}){
if(data){//check the condition
let option = [];//used to add all category in for each loop
let options = [];//used to add only parent category in for each loop
data.forEach(element => {//for each function. put each category in element variable.
/*add each category name, id and parentcategory id in to array with 
the below keys (label, value, parentCategoryId )*/ 
options.push({label: element.Name, value: element.Id, parentCategoryId:element.ParentCategory__c});
/*looks if data not have parentcategory id, which means it is parent category
so, adds them with category name, id and parentcategory id in to array with 
the below keys (label, value, parentCategoryId ). theses are showed in parent category combobox*/ 
if(element.ParentCategory__c==null){
option.push({label: element.Name, value: element.Id, parentCategoryId:element.ParentCategory__c});
}});
//assign all and parent categories to variables
this.allCategories = options;     
this.parentCategories = option; //calls from first combobox 
console.log('Option is ' + JSON.stringify(this.parentCategories))
}
else if(error){
console.log('Error is' + JSON.stringify(error))
}} 

// wire with apex class with sending all selected category Ids and getting related products 
@wire(getAllProducts, { categIds: '$catIds'}) allProduct;

/*function calls from first combobox to get second combobox values
initially give false not to show combobox then add related categoriy 
values and show second combobox with the sub category 1 values*/
handleParentCategoryChange(event) {
this.selectedParentCategory=event.detail.value;//get selected parent category
//needed var
let options = [];//used to add only sub category 1 in for each loop
this.subCat1=false;//initial value not to show second combobox
this.subCat2=false;//initial value not to show third combobox
this.categoryIds=[];//clear categoryIds array
this.categoryId=[];//clear categoryId array
/*for each function. looks only categories which have same parent category selected in first combobox
and add each category name, id and parentcategory id in to array with 
the below keys (label, value, parentCategoryId ). Make also subCat1 true to show second combobox*/ 
this.allCategories.forEach(element => {
if(element.parentCategoryId==this.selectedParentCategory){
this.subCat1=true;//makes second combobox visible
options.push({label: element.label, value: element.value, parentCategoryId:element.parentCategoryId});
this.categoryId.push (element.value);
}});
console.log(JSON.stringify(this.categoryId));
/*nested for each function. looks only categories which have same parent category selected in second combobox
and add each id (value) in to array*/ 
this.categoryId.forEach(element => {
this.categoryIds.push (element);//add subcategory 1 ids, if we don't have any subcotegory 2 item under subcat 1. then it will get aslo this products.
this.allCategories.forEach(elements => {
if(elements.parentCategoryId==element){
this.categoryIds.push (elements.value);//push all sub categories 2 ids
}})});
this.subCategories1 = options;//assign all subcategory 1 shows in second combobox
this.selectedSubCategory1=null;//clear selectedSubCategory1
this.selectedSubCategory2=null; //clear selectedSubCategory2
console.log(JSON.stringify(this.categoryIds));
} 

/*function calls from second combobox to get third combobox values
initially give false not to show combobox then add related category 
values and show third combobox with the sub category 2 values*/
handleSubCategory1Change(event) {
this.selectedSubCategory1=event.detail.value;
console.log(JSON.stringify(this.selectedSubCategory1));
let options = [];//used to add only sub category 2 in for each loop
this.subCat2=false//initial value not to show third combobox
this.categoryIds=[];//clear categoryIds array
/*for each function. looks only categories which have same parent category selected in second combobox
and add each category name, id and parentcategory id in to array with 
the below keys (label, value, parentCategoryId ). Make also subCat2 true to show third combobox*/ 
this.categoryIds.push (this.selectedSubCategory1);//add subcategory 1 id, if we don't have any subcotegory 2 item under subcat 1. then it will get aslo this products.
this.allCategories.forEach(element => {
if(element.parentCategoryId==this.selectedSubCategory1){
this.subCat2=true;
options.push({label: element.label, value: element.value, parentCategoryId:element.parentCategoryId});
this.categoryIds.push (element.value);
}});
this.subCategories2 = options;//assign all subcategory 2 shows in third combobox 
this.selectedSubCategory2=null;//clear selectedSubCategory2
} 

//function calls from third combobox to get third combobox values

handleSubCategory2Change(event) {
this.selectedSubCategory2=event.detail.value;
}

//function calls from search button to assign all category ids which will be sent to and queried in apex class to get all related products.
handleFilterClick(){
if(this.selectedSubCategory2!=null){//looks if third combobox is chosen, then assing ids.
this.catIds= this.selectedSubCategory2;
} else if(this.selectedSubCategory1!=null && this.selectedSubCategory2==null){//looks if third combobox is not chosen, but second one chosen then assing ids.
this.catIds= this.categoryIds;
} else if(this.selectedSubCategory1==null && this.selectedSubCategory2==null) {//looks if only first is chosen, theen assing ids.
this.catIds= this.categoryIds;
}}  

}