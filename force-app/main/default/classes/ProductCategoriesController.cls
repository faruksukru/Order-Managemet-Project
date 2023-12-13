Public without sharing class ProductCategoriesController {
    //query all categories from category object send it to parent js
    @AuraEnabled(cacheable=true)
    Public static List<Category__c> getAllCategories(){
        Return [SELECT id, Name, ParentCategory__c FROM Category__c];
    }
    //get category ids from js and queried all products wtih needed information and to main js
    @AuraEnabled(cacheable=true)
    Public static List<Product2> getAllProduct(List<string> categIds){
      Return [SELECT id, Name, RemainingQuantity__c, (SELECT URL__c, Hero_Image__c FROM Product_Imageses__r ),(SELECT UnitPrice FROM PricebookEntries) 
       FROM Product2 WHERE id IN (SELECT Product__c FROM Product_Category__c WHERE Category__c in:categIds)];
     }
}