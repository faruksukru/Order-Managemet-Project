public with sharing class ProductDetailsController {
//get recorId from JS, make query and send back to product detail information
@AuraEnabled(cacheable=true)
Public static List<Product2> getProductDetails(string productId){
Return [SELECT id, Name, RemainingQuantity__c, Description, Stock_Status__c,(SELECT URL__c FROM Product_Imageses__r ),(SELECT UnitPrice FROM PricebookEntries) 
FROM Product2 WHERE id =:productId];
}

/*get recorId from JS, send back to similar products. 
In first query get parent category of the product, 
in second query get products have same parent category and put in set of ID,
in third query get all needed information for all similar products and return to JS 
*/
@AuraEnabled(cacheable=true)
Public static List<Product2> getSimilarProduct(string productId){
Product_Category__c category = [SELECT Category__c, Parent_Category__c FROM Product_Category__c WHERE Product__c =:productId];
List<Product_Category__c> similarProducts=[SELECT Product__c FROM Product_Category__c WHERE Parent_Category__c = :category.Parent_Category__c];
Set<Id> similarProductIds = new Set<Id>();//keep all similar products IDs
for (Product_Category__c eachProduct:similarProducts){
similarProductIds.add(eachProduct.Product__c);
}
similarProductIds.remove(productId);//remove our product Id not show in similar products
Return [SELECT id, Name, RemainingQuantity__c, (SELECT URL__c, Hero_Image__c FROM Product_Imageses__r ),(SELECT UnitPrice FROM PricebookEntries) 
FROM Product2 WHERE id IN :similarProductIds];
}

@AuraEnabled(cacheable=false) 
Public static void createCartItem(string productId, Integer quantity){
    Cart_Item__c newCartItem = new Cart_Item__c();
    newCartItem.Product__c=productId;
    newCartItem.Quantity__c=quantity;
    newCartItem.Cart__c='a09Do0000049mtTIAQ';
   system.debug(newCartItem);
    insert newCartItem;
}

@AuraEnabled(cacheable=true)
Public static List<Cart_Item__c> getCartItems(string cartId){
Return [SELECT id, Amount__c, Quantity__c, TotalAmount__c, Product__r.Name, Product__r.Product_Image__c  FROM Cart_Item__c WHERE Cart__c =:cartId];
}

}