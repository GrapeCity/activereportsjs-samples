import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Designer as ReportDesigner } from '@grapecity/activereports/reportdesigner';

@Component({
  selector: 'gc-activereports-designer',
  templateUrl: './activereports-designer.component.html',
  styleUrls: ['./activereports-designer.component.css'],
})
export class DesignerComponent implements OnInit, OnChanges {
  @Input() public report: string;
  @Input() public onRender: any;

  designer: any;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (
      this.designer &&
      changes.report &&
      changes.report.currentValue !== changes.report.previousValue
    ) {
      this.designer.setReport(this.report);
    }
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.designer = new ReportDesigner('#arjs-designer-host');
    this.designer.setReport(this.report);
    this.designer.setActionHandlers({
      onRender: this.onRender,
    });
  }
}
