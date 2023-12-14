// RecordController.cls
public with sharing class RecordController {
    @AuraEnabled
    public static Id createRecord(String name) {
        try {
            // Create a new record
           Applicant__c newRecord = new Applicant__c(
            First_Name__c = name
                // Add other fields as needed
            );

            // Insert the new record
            insert newRecord;

            // Return the Id of the new record
            return newRecord.Id;
        } catch (Exception e) {
            // Handle exceptions and log errors
            System.debug('Error creating record: ' + e.getMessage());
            throw new AuraHandledException('Error creating record: ' + e.getMessage());
        }
    }
}
