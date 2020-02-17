import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { MatSnackBar, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CancelIRN } from 'app/models/invoice-details';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-cancel-irn-dialog',
  templateUrl: './cancel-irn-dialog.component.html',
  styleUrls: ['./cancel-irn-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class CancelIrnDialogComponent implements OnInit {

  cancelIRNdForm: FormGroup;
  cancelIRN: CancelIRN;
  notificationSnackBarComponent: NotificationSnackBarComponent;

  constructor(
    public matDialogRef: MatDialogRef<CancelIrnDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder,
    public snackBar: MatSnackBar

  ) {
    this.cancelIRNdForm = this._formBuilder.group({
      cancelReason: ['', Validators.required],
      cancelReasonRemark:['',Validators.required]
      
    });
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
  }

  ngOnInit(): void {
  }

  YesClicked(): void {
    if (this.cancelIRNdForm.valid) {
      this.cancelIRN = new CancelIRN();
      this.cancelIRN.CancelReason = this.cancelIRNdForm.get('cancelReason').value;
      this.cancelIRN.CancelReasonRemark = this.cancelIRNdForm.get('cancelReasonRemark').value;
      this.matDialogRef.close(this.cancelIRN);
    } else {
      Object.keys(this.cancelIRNdForm.controls).forEach(key => {
        this.cancelIRNdForm.get(key).markAsTouched();
        this.cancelIRNdForm.get(key).markAsDirty();
      });

    }
  }

  CloseClicked(): void {
    // console.log('Called');
    this.matDialogRef.close(null);
  }
}
