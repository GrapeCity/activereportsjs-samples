import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Inject,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  AR_EXPORTS,
  HtmlExportService,
  PdfExportService,
  ViewerComponent,
  DesignerComponent,
  XlsxExportService,
} from '@grapecity/activereports-angular';
import reports from './reports.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: AR_EXPORTS,
      useClass: PdfExportService,
      multi: true,
    },
    {
      provide: AR_EXPORTS,
      useClass: HtmlExportService,
      multi: true,
    },
    {
      provide: AR_EXPORTS,
      useClass: XlsxExportService,
      multi: true,
    },
  ],
})
export class AppComponent {
  designerHidden = true;
  currentReport: any = { id: reports[0].src, displayName: reports[0].name };
  toolbarUpdated = false;
  reportList = reports;

  @ViewChild(ViewerComponent, { static: false }) reportViewer: ViewerComponent;
  @ViewChild(DesignerComponent, { static: false })
  reportDesigner: DesignerComponent;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.onRender = this.onRender.bind(this);
  }

  onRender(report: any): any {
    this.designerHidden = true;
    this.currentReport = { definition: report.definition };
    if (!this.toolbarUpdated) {
      this.updateViewerToolbar();
      this.toolbarUpdated = true;
    }
    this.reportViewer.open(report.definition);
    this.changeDetectorRef.detectChanges();
    return Promise.resolve();
  }

  ensureStylesheet(stylesheetId: string, stylesheetContent: string) {
    const head = this.document.getElementsByTagName('head')[0];
    var style = this.document.getElementById(stylesheetId);
    if (!style) {
      style = this.document.createElement('style');
      style.id = stylesheetId;
      style.innerHTML = stylesheetContent;
    }
    head?.appendChild(style);
  }

  reportSelectionChanged(report) {
    this.currentReport = { id: report.src, displayName: report.name };
    if (this.designerHidden) {
      this.reportViewer.open(report.src);
    }
  }

  onViewerInit() {
    this.updateViewerToolbar();
    this.reportViewer.open(this.currentReport.id);
  }

  updateViewerToolbar() {
    var designButton = {
      key: '$openDesigner',
      text: 'Edit in Designer',
      iconCssClass: 'mdi mdi-pencil',
      enabled: true,
      action: () => {
        this.designerHidden = false;
        this.changeDetectorRef.detectChanges();
      },
    };
    this.reportViewer.toolbar.addItem(designButton);
    this.reportViewer.toolbar.updateLayout({
      default: [
        '$openDesigner',
        '$split',
        '$navigation',
        '$split',
        '$refresh',
        '$split',
        '$history',
        '$split',
        '$zoom',
        '$fullscreen',
        '$split',
        '$print',
        '$split',
        '$singlepagemode',
        '$continuousmode',
        '$galleymode',
      ],
    });
  }
}
