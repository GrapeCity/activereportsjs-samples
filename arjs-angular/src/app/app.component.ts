import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import {
  AR_EXPORTS,
  HtmlExportService,
  PdfExportService,
  ViewerComponent,
  XlsxExportService,
} from '@grapecity/activereports-angular';
import { DesignerComponent } from './activereports-designer/activereports-designer.component';
import reports from './reports.json';
import themes from './themes.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
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
  themeList = themes;
  appClass = themes[0].class;

  @ViewChild(ViewerComponent, { static: false }) reportViewer: ViewerComponent;
  @ViewChild(DesignerComponent, { static: false })
  reportDesigner: DesignerComponent;

  constructor(private changeDetectorRef: ChangeDetectorRef) {
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

  ngAfterViewInit(): void {}

  reportSelectionChanged(report) {
    this.currentReport = { id: report.src, displayName: report.name };
    if (this.designerHidden) {
      this.reportViewer.open(report.src);
    }
  }

  themeChanged(themeClass) {
    this.appClass = themeClass;
    this.changeDetectorRef.detectChanges();
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
