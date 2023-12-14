// newRecordForm.js
import { LightningElement, track } from 'lwc';
import createRecord from '@salesforce/apex/RecordController.createRecord';

export default class NewRecordForm extends LightningElement {
    @track recordName = '';
    @track newRecordId;

    handleNameChange(event) {
        this.recordName = event.target.value;
    }

    handleFileUploadFinished(event) {
        // Handle file upload completion if needed
        // You can obtain file details from event.detail.files
    }

    handleSave() {
        // Perform record creation using Apex
        createRecord({ name: this.recordName })
            .then(newRecordId => {
                this.newRecordId = newRecordId;

                // Pass the newRecordId to the file upload component
                const fileUploadComponent = this.template.querySelector('c-file-upload-component');
                if (fileUploadComponent) {
                    fileUploadComponent.recordId = newRecordId;
                }

                // Optionally, you can reset the form or perform other actions after record creation
                this.resetForm();
            })
            .catch(error => {
                // Handle error, show error message, etc.
                console.error(error);
            });
    }

    resetForm() {
        // Reset form fields to their initial state
        this.recordName = '';
        this.newRecordId = null;
    }
}
