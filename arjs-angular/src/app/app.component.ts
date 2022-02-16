import { DOCUMENT } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
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
  TabularDataExportService,
} from '@grapecity/activereports-angular';
import reports from './reports.json';
import themes from './themes.json';
declare var require: any;


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
      useClass: TabularDataExportService,
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
  themeClass = '';
  public styles: SafeHtml;  

  @ViewChild(ViewerComponent, { static: false }) reportViewer: ViewerComponent;
  @ViewChild(DesignerComponent, { static: false })
  reportDesigner: DesignerComponent;

  constructor(
    private sanitizer: DomSanitizer,
    private changeDetectorRef: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.onRender = this.onRender.bind(this);
  }

  ngOnInit(): void {
    this.loadThemes(themes[0].class);
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

  loadThemes(themeId: string) {
    const commonCss =
      require(`!!raw-loader!@grapecity/activereports/styles/${themeId}-ui.css`).default;

    const viewerCss =
      require(`!!raw-loader!@grapecity/activereports/styles/${themeId}-viewer.css`).default;
    const designerCss =
      require(`!!raw-loader!@grapecity/activereports/styles/${themeId}-designer.css`).default;

    this.styles = this.sanitizer.bypassSecurityTrustHtml(`
      <style>${designerCss}</style>
      <style>${viewerCss}</style>
      <style>${commonCss}</style>
    `);
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
  
  themeChanged(themeClass) {
    this.themeClass = themeClass;
    this.loadThemes(themeClass);
    this.changeDetectorRef.detectChanges();
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
