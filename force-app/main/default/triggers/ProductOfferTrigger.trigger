trigger ProductOfferTrigger on Product_Offers__c (after insert) {
    if(Trigger.isAfter&& Trigger.isInsert){
      ProductOfferTriggerHandler.sendEmail(Trigger.new);  
    }
}