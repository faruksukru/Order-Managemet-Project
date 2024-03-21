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
/* get product id create cartitem related with cart for customer user
Here we use hard code for cart. For each custome user we will have one cart.
So we will have to use this cart when any user login. Cahnge hard code with getting cart id related with user */
@AuraEnabled(cacheable=false) 
Public static void createCartItem(string productId, Integer quantity){
    Cart_Item__c newCartItem = new Cart_Item__c();
    newCartItem.Product__c=productId;
    newCartItem.Quantity__c=quantity;
    newCartItem.Cart__c='a09Do0000049mtTIAQ';
   system.debug(newCartItem);
    insert newCartItem;
}
/* To get all cart items in cart. This show in UI to the user which items user has in cart */
@AuraEnabled(cacheable=true)
Public static List<Cart_Item__c> getCartItems(string cartId){
Return [SELECT id, Amount__c, Quantity__c, TotalAmount__c, Product__c, Product__r.Name, Product__r.Product_Image__c, 
Product__r.RemainingQuantity__c  FROM Cart_Item__c WHERE Cart__c =:cartId];
}
// when choosen delete any cart item, it deletes this cart item  from cart 
@AuraEnabled(cacheable=false) 
Public static void deleteCartItem(string cartItemId){
    Delete [SELECT id FROM Cart_Item__c WHERE id =:cartItemId];
}
//if quantity of ant cartitem increse or decrease it updates with new quantity
@AuraEnabled(cacheable=false) 
Public static void changeQuantity(string cartItemId, Integer cartItemQuantity){
    system.debug('id='+cartItemId+ 'quantity='+cartItemQuantity);
    Cart_Item__c updcrtItem = [SELECT id, Quantity__c FROM Cart_Item__c WHERE id=:cartItemId]; 
    updcrtItem.Quantity__c=cartItemQuantity;
    update updcrtItem;
}
// it returns customer user adress books, adress book is create for each customer user.
@AuraEnabled(cacheable=true)
Public static List<Address_Book__c> getAddress(string customerUserId){
Return [SELECT id, Name, Address__c, City__c, Country__c, Phone__c, PostalCode__c, State__c FROM Address_Book__c WHERE User__c=:customerUserId];
}
//if custome user update address, it gets userid and adress book id to update
@AuraEnabled(cacheable=false) 
Public static void addCustomerId(string addressBookId, string customerUserId){
    Address_Book__c address = [SELECT id, User__c FROM Address_Book__c WHERE id=:addressBookId]; 
    address.User__c=customerUserId;
    update address;
}
//if custome user delete address, it gets adress book id to delete
@AuraEnabled(cacheable=false) 
Public static void deleteAddress(string addressBookId){
    Delete [SELECT id FROM Address_Book__c WHERE id=:addressBookId]; 
}

}