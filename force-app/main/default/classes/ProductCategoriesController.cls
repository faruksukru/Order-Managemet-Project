public without sharing class ProductCategoriesController {
    @AuraEnabled(cacheable=true)
    public static List<Category__c> getAllCategories(){
        Return [SELECT id, Name, ParentCategory__c FROM Category__c];
    }
    @AuraEnabled(cacheable=true)
    Public static List<Product2> getAllProduct(List<string> categIds){
      Return [SELECT id, Name, RemainingQuantity__c, (SELECT URL__c FROM Product_Imageses__r ),(SELECT UnitPrice FROM PricebookEntries) 
       FROM Product2 WHERE id IN (SELECT Product__c FROM Product_Category__c WHERE Category__c in:categIds)];
       //Return [SELECT id, Name, RemainingQuantity__c FROM Product2 WHERE id in (SELECT Product__c FROM Product_Category__c WHERE Category__c =:categIds)];
    
    }
}