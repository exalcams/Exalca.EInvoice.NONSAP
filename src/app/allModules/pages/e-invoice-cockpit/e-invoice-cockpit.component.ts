import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry, MatSnackBar, MatTableDataSource, MatPaginator, MatSort, MatDialogConfig, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { AuthenticationDetails } from 'app/models/master';
import { fuseAnimations } from '@fuse/animations';
import { InvoiceDetails, CancelIRN } from 'app/models/invoice-details';
import { DashboardService } from 'app/services/dashboard.service';
import { PdfDialogComponent } from '../pdf-dialog/pdf-dialog.component';
import { DatePipe } from '@angular/common';
import { SelectionModel } from '@angular/cdk/collections';
import { CancelIrnDialogComponent } from '../cancel-irn-dialog/cancel-irn-dialog.component';
import * as shape from 'd3-shape';
import { ViewChild, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-e-invoice-cockpit',
  templateUrl: './e-invoice-cockpit.component.html',
  styleUrls: ['./e-invoice-cockpit.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class EInvoiceCockpitComponent implements OnInit {
  authenticationDetails: AuthenticationDetails;
  MenuItems: string[];
  isProgressBarVisibile: boolean;
  allInvoicesCount: number;
  SelectedINV: InvoiceDetails;
  selection = new SelectionModel<InvoiceDetails>(true, []);
  INVID:number;
  CancelReason:string;
  CancelReasonRemark:string;
  @ViewChild(MatPaginator) ConfigurationsPaginator: MatPaginator;
  notificationSnackBarComponent: NotificationSnackBarComponent;
  allInvoiceDetails: InvoiceDetails[] = [];
  isDateError: boolean;
  displayedColumns: string[] = [
      "Select",
      "Document_Type",
      "Type",
      "Invoice_Number",
      "Invoice_Date",
      "Customer",
      "Plant",
      "IRN",
      "IRN_Date",
      // "IRN_Time",
      "ACK_Number",
      "Status",
      "View"
  ];
  dataSource = new MatTableDataSource<InvoiceDetails>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  widget5: any = {};
  widget6: any = {};
  InvoiceFilterFormGroup: FormGroup;
  constructor(
      private _router: Router,
      private _formBuilder: FormBuilder,
      sanitizer: DomSanitizer,
      private _datePipe: DatePipe,
      private dialog: MatDialog,
      private _dashboardService: DashboardService,
      public snackBar: MatSnackBar
  ) {
      this.isProgressBarVisibile = true;
      this.notificationSnackBarComponent = new NotificationSnackBarComponent(
          this.snackBar
      );
  }

  ngOnInit(): void {
      // Retrive authorizationData
      const retrievedObject = localStorage.getItem("authorizationData");
      if (retrievedObject) {
          this.authenticationDetails = JSON.parse(
              retrievedObject
          ) as AuthenticationDetails;
          this.MenuItems = this.authenticationDetails.menuItemNames.split(
              ","
          );
          if (this.MenuItems.indexOf("Dashboard") < 0) {
              this.notificationSnackBarComponent.openSnackBar(
                  "You do not have permission to visit this page",
                  SnackBarStatus.danger
              );
              this._router.navigate(["/auth/login"]);
          }
      } else {
          this._router.navigate(["/auth/login"]);
      }
      this.InvoiceFilterFormGroup = this._formBuilder.group({
        InvNumber: [''],
        StartDate: [],
        EndDate: [],
    });
      this.ResetValues();
      this.getAllInvoiceDetails();
  }

  applyFilter(filterValue: string): void {
      this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ResetValues(): void {
    this.allInvoiceDetails = [];
    this.ResetCheckbox();
  }

  ResetCheckbox(): void {
    this.SelectedINV=new InvoiceDetails();
    this.selection.clear();
    if (this.dataSource && this.dataSource.data) {
      this.dataSource.data.forEach(row => this.selection.deselect(row));
    }
  }

  getAllInvoiceDetails(): void {
      this.isProgressBarVisibile = true;
      this._dashboardService
          .GetAllInvoiceDetails()
          .subscribe(
              data => {
                  this.allInvoiceDetails = data as InvoiceDetails[];
                  this.allInvoicesCount = this.allInvoiceDetails.length;
                  this.dataSource = new MatTableDataSource(
                      this.allInvoiceDetails
                  );
                  this.dataSource.paginator = this.paginator;
                  this.dataSource.sort = this.sort;
                  this.isProgressBarVisibile = false;
                  this.ResetCheckbox();
                  this.INVID = null;
              },
              err => {
                  this.isProgressBarVisibile = false;
                  this.notificationSnackBarComponent.openSnackBar(
                      err instanceof Object ? "Something went wrong" : err,
                      SnackBarStatus.danger
                  );
              }
          );
  }

  onChangeChk($event, data: InvoiceDetails): void {
    this.INVID = data.InvoiceID;
    if ($event.source.checked) {
      this.SelectedINV = data;
    } else {
      this.INVID = null;
      this.SelectedINV = null;
    }
  }

  GenarateIRN() : void {
    if(this.INVID != null){
      this.isProgressBarVisibile = true;
      this._dashboardService.GenerateIrnDetails(this.INVID).subscribe(
        (data) => {
          this.isProgressBarVisibile = false;
          this.notificationSnackBarComponent.openSnackBar(data.toString(), SnackBarStatus.success);
          this.getAllInvoiceDetails();
        },
        (err) => {
          console.error(err);
          this.isProgressBarVisibile = false;
          this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
        }
      );
    }
    else{
      this.notificationSnackBarComponent.openSnackBar('Please select the invoice', SnackBarStatus.danger);
    }
   
  }

  ViewPdfFromID(ID: number, fileName: string): void {
      //this.IsProgressBarVisibile = true;
      this._dashboardService.DowloandPdfFromID(ID).subscribe(
        data => {
          const file = new Blob([data], { type: 'application/pdf' });
          // const fileURL = URL.createObjectURL(file);
          // window.open(fileURL);
          const dialogConfig: MatDialogConfig = {
            data: file,
            panelClass: 'pdf-dialog'
          };
          const dialogRef = this.dialog.open(PdfDialogComponent, dialogConfig);
          dialogRef.afterClosed().subscribe(
            result => {
              if (result) {
              }
            });
          //this.IsProgressBarVisibile = false;
        },
        error => {
          console.error(error);
          //this.IsProgressBarVisibile = false;
        }
      );
  }

  CancelIrnDetailsClick(): void {
    if(this.INVID != null){
      const dialogConfig: MatDialogConfig = {
        data: null,
        panelClass: 'cancel-irn-dialog'
    };
    const dialogRef = this.dialog.open(CancelIrnDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
        result => {
            if (result) {
                const cancelIRN = result as CancelIRN;
                this.CancelReason=cancelIRN.CancelReason;
                this.CancelReasonRemark=cancelIRN.CancelReasonRemark;
                this.isProgressBarVisibile = true;
                this._dashboardService.CancelIrnDetails(this.INVID,this.CancelReason,this.CancelReasonRemark).subscribe(
                    (res) => {
                        console.log(res);
                        this.isProgressBarVisibile = false;
                        this.notificationSnackBarComponent.openSnackBar(res.toString(), SnackBarStatus.success);
                        this.getAllInvoiceDetails();
                    }, (err) => {
                      console.error(err);
                      this.isProgressBarVisibile = false;
                      this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
                    }
                );
            }
        });
    }
    else{
      this.notificationSnackBarComponent.openSnackBar('Please select the invoice', SnackBarStatus.danger);
    }
  }

  SearchInvoices(): void {
    if (this.InvoiceFilterFormGroup.valid) {
      if (!this.isDateError) {
        const invnumber = this.InvoiceFilterFormGroup.get('InvNumber').value;
        let StartDate = null;
        const staDate = this.InvoiceFilterFormGroup.get('StartDate').value;
        if (staDate) {
            StartDate = this._datePipe.transform(staDate, 'yyyy-MM-dd');
        }
        let EndDate = null;
        const enDate = this.InvoiceFilterFormGroup.get('EndDate').value;
        if (enDate) {
            EndDate = this._datePipe.transform(enDate, 'yyyy-MM-dd');
        }
        this.isProgressBarVisibile = true;
        this._dashboardService.GetAllEInvoiceDetailsBasedOnSearch(invnumber, staDate, enDate) .subscribe(
          data => {
              this.allInvoiceDetails = data as InvoiceDetails[];
              this.allInvoicesCount = this.allInvoiceDetails.length;
              this.dataSource = new MatTableDataSource(
                  this.allInvoiceDetails
              );
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
              this.isProgressBarVisibile = false;
              this.ResetCheckbox();
              this.INVID = null;
          },
          err => {
              this.isProgressBarVisibile = false;
              this.notificationSnackBarComponent.openSnackBar(
                  err instanceof Object ? "Something went wrong" : err,
                  SnackBarStatus.danger
              );
          }
      );
    }
    }
  }

  DateSelected(): void {
    const FROMDATEVAL = this.InvoiceFilterFormGroup.get('StartDate').value as Date;
    const TODATEVAL = this.InvoiceFilterFormGroup.get('EndDate').value as Date;
    if (FROMDATEVAL && TODATEVAL && FROMDATEVAL > TODATEVAL) {
        this.isDateError = true;
    } else {
        this.isDateError = false;
    }
}
onKeydown(event): boolean {
    // console.log(event.key);
    if (event.key === 'Backspace' || event.key === 'Delete') {
        return true;
    } else {
        return false;
    }
}
  Print(): void{
    window.print();
  }
}

