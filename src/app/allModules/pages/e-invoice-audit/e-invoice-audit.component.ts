import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogConfig, MatPaginator, MatSnackBar, MatSort, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { EinvoiceAuditLog } from 'app/models/invoice-details';
import { AuthenticationDetails } from 'app/models/master';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { DashboardService } from 'app/services/dashboard.service';
import { JsonDialogComponent } from '../json-dialog/json-dialog.component';
import { PdfDialogComponent } from '../pdf-dialog/pdf-dialog.component';


@Component({
  selector: 'app-e-invoice-audit',
  templateUrl: './e-invoice-audit.component.html',
  styleUrls: ['./e-invoice-audit.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class EInvoiceAuditComponent implements OnInit {

  authenticationDetails: AuthenticationDetails;
  MenuItems: string[];
  isProgressBarVisibile: boolean;
  @ViewChild(MatPaginator) ConfigurationsPaginator: MatPaginator;
  notificationSnackBarComponent: NotificationSnackBarComponent;
  displayedColumns: string[] = [
      "InvNO",
      "Plant",
      "Responce",
      "JsonValue"
  ];
  dataSource = new MatTableDataSource<EinvoiceAuditLog>();
  allEinvoiceAuditLogDetails: EinvoiceAuditLog[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  widget5: any = {};
  widget6: any = {};

  constructor(
    private _router: Router,
    private datePipe: DatePipe,
    private _dashboardService: DashboardService,
    private dialog: MatDialog,
    public snackBar: MatSnackBar
) {
    this.isProgressBarVisibile = true;
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(
        this.snackBar
    );
}

  ngOnInit() {
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
    // this.ResetValues();
    this.getAllEinvoiceAuditLogDetails();
  }
  getAllEinvoiceAuditLogDetails(): void {
    this.isProgressBarVisibile = true;
    this._dashboardService
        .GetAllEinvoiceAuditLogDetails()
        .subscribe(
            data => {
                this.allEinvoiceAuditLogDetails = data as EinvoiceAuditLog[];
                this.dataSource = new MatTableDataSource(
                    this.allEinvoiceAuditLogDetails
                );
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                this.isProgressBarVisibile = false;
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
ViewJSON(jsonData:string): void {
  const dialogRef = this.dialog.open(JsonDialogComponent, {
    width: '700px',
    data: {name: jsonData}
    
  });
  dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed');
  });
}

// ViewJSON(jsonData:string): void {
//   alert(jsonData);
//       const dialogConfig: MatDialogConfig = {
//         data: jsonData,
//         panelClass: 'JSON Data'
//       };
//       const dialogRef = this.dialog.open(JsonDialogComponent, dialogConfig);
//       dialogRef.afterClosed().subscribe(
//         result => {
//           if (result) {
//           }
//         });
//       //this.IsProgressBarVisibile = false;
    
// }
}
export interface DialogData {
  name: string;
}
