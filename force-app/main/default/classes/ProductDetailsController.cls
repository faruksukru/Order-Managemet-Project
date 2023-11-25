public with sharing class ProductDetailsController {
    @AuraEnabled(cacheable=true)
    Public static List<Product2> getProductDetails(string productId){
      Return [SELECT id, Name, RemainingQuantity__c, Description, Stock_Status__c,(SELECT URL__c FROM Product_Imageses__r ),(SELECT UnitPrice FROM PricebookEntries) 
       FROM Product2 WHERE id =:productId];
       //Return [SELECT id, Name, RemainingQuantity__c FROM Product2 WHERE id in (SELECT Product__c FROM Product_Category__c WHERE Category__c =:categIds)];
    
    }
}