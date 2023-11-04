public class ProductOfferTriggerHandler {
    public static void sendEmail(List<Product_Offers__c> offerList){
        List<Id> productIds = new List<Id>();
        for(Product_Offers__c offer:offerList){
            productIds.add(offer.product__c);
        }
        List<Product_Images__c> prdtcImageList = [SELECT Id, Name, Product__c, URL__c, Resource__c, ResourceURL__c FROM Product_Images__c WHERE Product__c =:productIds];
        Profile getProfileId = [SELECT id FROM Profile WHERE Name ='E-Zone Profile'];
        List<User> customerUserList = [SELECT id, Name, Email, IsActive FROM User WHERE IsActive=True and Profileid=:getProfileId.Id];
        List<Messaging.SingleEmailMessage> allEmails = new List <Messaging.SingleEmailMessage>(); 
        Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage(); 
        List<String> emailAddress = new List<String>();
        for(User eachUser:customerUserList){
            if(!String.isBlank(eachUser.email)){
                emailAddress.add(eachUser.email);
            }
        }
        email.setToAddresses(emailAddress);
        email.setSubject('A new Offer is created');
        String singleBody = '<p> <span style="font-size: 18pt; color:Red;">New offers have been defined for You!</span></p>';
        singleBody += '<p> <span style="font-size: 12pt; color:Blue;">You can click "See Offer!" button to see the details.</span></p>';
        for (Product_Images__c prdtcImage:prdtcImageList){
            singleBody+='<p><img width="200" height="200" src="'+prdtcImage.URL__c+'" /></p>';
            singleBody+='<a href = "https://talenttech2-dev-ed.develop.lightning.force.com/lightning/r/Product_Offers__c/'+prdtcImage.product__c+'/view">';
            singleBody+='<button type="button" style="color: white;background-color:Blue;padding: 10px 32px;font-size: 26px;margin: 4px 2px;font-family:Arial">See Offer!</button>';
            singleBody+='<br>';
        }
        email.setHtmlBody(singleBody);
        allEmails.add(email);
        Messaging.sendEmail(allEmails);
    }
}