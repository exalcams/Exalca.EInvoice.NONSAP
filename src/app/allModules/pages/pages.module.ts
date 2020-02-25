import { NgModule, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
    MatFormFieldModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule
} from '@angular/material';

import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FuseCountdownModule, FuseHighlightModule, FuseMaterialColorPickerModule, FuseWidgetModule, FuseSidebarModule } from '@fuse/components';

import { FuseSharedModule } from '@fuse/shared.module';
import { FormsModule } from '@angular/forms';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardService } from 'app/services/dashboard.service';
import { PdfDialogComponent } from './pdf-dialog/pdf-dialog.component';
import { CancelIrnDialogComponent } from './cancel-irn-dialog/cancel-irn-dialog.component';
import { ProjectDashboardComponent } from './project/project.component';
import { ProjectDashboardService } from './project/project.service';
import { EInvoiceCockpitComponent } from './e-invoice-cockpit/e-invoice-cockpit.component';
import { ChartsModule } from 'ng2-charts';

const routes = [
    
    {
        path: 'project-dashboard',
        component: ProjectDashboardComponent, resolve: {
            data: ProjectDashboardService
    }
    },
    {
        path: 'dashboard',
        component: DashboardComponent
    },
    {
        path: 'e-invoice-cockpit',
        component: EInvoiceCockpitComponent
    },
    {
        path: '**',
        redirectTo: '/auth/login'
    }

];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        // HttpClientModule,
        // TranslateModule,
        MatFormFieldModule,
        MatAutocompleteModule,
        MatBadgeModule,
        MatBottomSheetModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatCardModule,
        MatCheckboxModule,
        MatChipsModule,
        MatStepperModule,
        MatDatepickerModule,
        MatDialogModule,
        MatDividerModule,
        MatExpansionModule,
        MatGridListModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatNativeDateModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        MatRippleModule,
        MatSelectModule,
        MatSidenavModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatSortModule,
        MatTableModule,
        MatTabsModule,
        MatToolbarModule,
        MatTooltipModule,
        MatTreeModule,

        NgxChartsModule,

        FuseSharedModule,

        FuseCountdownModule,
        FuseHighlightModule,
        FuseMaterialColorPickerModule,
        FuseWidgetModule,
        FuseSidebarModule,

        FormsModule,
        NgxMaterialTimepickerModule,
        ChartsModule

    ],
    declarations: [DashboardComponent, PdfDialogComponent, CancelIrnDialogComponent, ProjectDashboardComponent, EInvoiceCockpitComponent],
    providers: [
        ProjectDashboardService
    ],
    entryComponents: [
        PdfDialogComponent,
        CancelIrnDialogComponent
    ]
})
export class PagesModule { }
