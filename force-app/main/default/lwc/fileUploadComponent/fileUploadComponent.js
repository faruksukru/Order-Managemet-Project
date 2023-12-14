// fileUploadComponent.js
import { LightningElement, api } from 'lwc';

export default class FileUploadComponent extends LightningElement {
    @api recordId; // Id of the related record
    acceptedFormats = ['.pdf', '.png', '.jpg', '.jpeg', '.docx'];

    handleUploadFinished(event) {
        // Get the uploaded files
        const uploadedFiles = event.detail.files;

        // Process the uploaded files, e.g., show a success message
        const toastEvent = new ShowToastEvent({
            title: 'Success!',
            message: `${uploadedFiles.length} files uploaded successfully.`,
            variant: 'success',
        });
        this.dispatchEvent(toastEvent);

        // You can perform additional actions like updating the record with the file information
        // using the Lightning Data Service or Apex.
    }
}
