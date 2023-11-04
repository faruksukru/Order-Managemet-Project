public without sharing class ProductCategoriesController {
    @AuraEnabled(cacheable=true)
    public static List<Category__c> getAllCategories(){
        Return [SELECT id, Name, ParentCategory__c FROM Category__c];
    }
}