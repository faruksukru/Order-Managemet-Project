import { LightningElement, wire, api } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class FileUpload extends LightningElement {
    @api recordId='a0CDo00000245v9MAA'; // Id of the related record
    acceptedFormats = ['.pdf', '.png', '.jpg', '.jpeg'];
    
    relatedRecordId;
    relatedRecordBool = false;
    currentPageReference;

    

    @wire( CurrentPageReference )
    setCurrentPageReference( currentPageReference ) {

        this.currentPageReference = currentPageReference;
        if ( this.currentPageReference.state.c__recId ) {

            this.relatedRecordId = this.currentPageReference.state.c__recId;
            this.relatedRecordBool = true;
            console.log( 'Rec Id is ' + this.relatedRecordId );

        } else {

            this.relatedRecordBool = false;

        }

    }

   /* handleUploadFinished(event) {

        const uploadedFiles = event.detail.files;
        let noOfFiles = uploadedFiles.length;
        console.log( 'No. of files uploaded', noOfFiles );
        this.dispatchEvent(
            new ShowToastEvent( {
                title: 'File(s) Download',
                message: noOfFiles + 'File(s) Uploaded Successfully!!!',
                variant: 'success'
            } ),
        );

    }*/

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

}
}