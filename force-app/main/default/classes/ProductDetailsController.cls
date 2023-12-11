public with sharing class ProductDetailsController {
@AuraEnabled(cacheable=true)
Public static List<Product2> getProductDetails(string productId){
Return [SELECT id, Name, RemainingQuantity__c, Description, Stock_Status__c,(SELECT URL__c FROM Product_Imageses__r ),(SELECT UnitPrice FROM PricebookEntries) 
FROM Product2 WHERE id =:productId];
}

@AuraEnabled(cacheable=true)
Public static List<Product2> getSimilarProduct(string productId){
Product_Category__c category = [SELECT Category__c, Parent_Category__c FROM Product_Category__c WHERE Product__c =:productId];
List<Product_Category__c> similarProducts=[SELECT Product__c FROM Product_Category__c WHERE Parent_Category__c = :category.Parent_Category__c];
Set<Id> similarProductIds = new Set<Id>();
for (Product_Category__c eachProduct:similarProducts){
similarProductIds.add(eachProduct.Product__c);
}
similarProductIds.remove(productId);
Return [SELECT id, Name, RemainingQuantity__c, (SELECT URL__c, Hero_Image__c FROM Product_Imageses__r ),(SELECT UnitPrice FROM PricebookEntries) 
FROM Product2 WHERE id IN :similarProductIds];
}
}