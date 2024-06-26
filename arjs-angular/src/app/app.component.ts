import {
  Component,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {
  AR_EXPORTS,
  HtmlExportService,
  PdfExportService,
  ViewerComponent,
  DesignerComponent,
  TabularDataExportService,
} from '@mescius/activereportsjs-angular';
import reports from './reports.json';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
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

  @ViewChild(ViewerComponent, { static: false }) reportViewer!: ViewerComponent;
  @ViewChild(DesignerComponent, { static: false })
  reportDesigner!: DesignerComponent;

  constructor() {
    this.onRender = this.onRender.bind(this);
  }

  ngOnInit(): void {
    this.reportDesigner.setReport(this.currentReport);
  }  
  
  onRender(report: any): any {
    this.designerHidden = true;
    this.currentReport = { definition: report.definition };
    if (!this.toolbarUpdated) {
      this.updateViewerToolbar();
      this.toolbarUpdated = true;
    }
    this.reportViewer.open(report.definition);
    return Promise.resolve();
  }


  reportSelectionChanged(report:any) {
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
