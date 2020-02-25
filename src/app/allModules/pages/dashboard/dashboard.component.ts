import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class DashboardComponent implements OnInit {
    showChart = false;
    canvasLabels = Array<any>();
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
    
    chartOptions = {
        responsive: true
      };
    
      chartData = [
        // { data: [330, 300, 260, 200], label: 'Account A' },
        // { data: [120, 455, 100, 340], label: 'Account B' },
        // { data: [45, 67, 500, 300], label: 'Account C' }
        { data: [20, 10, 30,18], label: 'Canceled' },
        { data: [35, 20, 32, 25], label: 'IRN Genarated' },
        { data: [15, 25, 19, 31], label: 'Invoice Created' }
      ];
    
      chartLabels = ['January', 'February', 'March', 'April'];
      
    
    constructor(
        private _router: Router,
        matIconRegistry: MatIconRegistry,
        sanitizer: DomSanitizer,
        private datePipe: DatePipe,
        private dialog: MatDialog,
        private _dashboardService: DashboardService,
        public snackBar: MatSnackBar
    ) {
        this.isProgressBarVisibile = true;
        this.notificationSnackBarComponent = new NotificationSnackBarComponent(
            this.snackBar
        );
        this.showChart = true;

        
        // this.widget5 = {
        //     data: {
        //         labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
        //         datasets: [
        //             {
        //                 type: 'line',
        //                 label: '',
        //                 data: [40,28,45,36,25,98,20],
        //                 fill: false,
        //                 lineTension: 0.4,
        //                 borderColor: ['#2979ff'],
        //                 // pointBorderColor: "#71a5e2",
        //                 pointRadius: 2,
        //                 // pointHoverRadius: 7,
        //                 // pointBorderWidth: 5,
        //                 // pointBorderColor: '#ffffff',
        //                 pointBackgroundColor: '#2979ff'
        //                 // borderWidth: 1
        //             },
        //             {
        //                 type: 'line',
        //                 label: '',
        //                 data: [40,28,45,36,25,98,20],
        //                 fill: false,
        //                 lineTension: 0.4,
        //                 borderColor: ['#e32049'],
        //                 // pointBorderColor: "#71a5e2",
        //                 pointRadius: 2,
        //                 // pointHoverRadius: 7,
        //                 // pointBorderWidth: 5,
        //                 // pointBorderColor: '#ffffff',
        //                 pointBackgroundColor: '#e32049'
        //                 // borderWidth: 1
        //             }
        //         ]
        //     },
        //     options: {
        //         title: {
        //             text: '',
        //             display: true
        //         },
        //         legend: {
        //             display: false
        //         },
        //         tooltips: {
        //             enabled: true
        //         },
        //         scales: {
        //             xAxes: [
        //                 {
        //                     barPercentage: 0.3,
        //                     valueFormatString: 'DD-MMM',
        //                     gridLines: {
        //                         display: false
        //                     }
        //                 }
        //             ],
        //             yAxes: [
        //                 {
        //                     ticks: {
        //                         beginAtZero: true,
        //                         gridLines: {
        //                             display: false
        //                         },
        //                         stepSize: 10
        //                     }
        //                 }
        //             ]
        //         }
        //     }
        // };
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

    Print(): void{
      alert('hi');
      window.print();
    }
}
