import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.css'],
})
export class ReportListComponent implements OnInit {
  @Input() reportList: any;
  @Output() selectionChanged = new EventEmitter<string>();
  activeIndex = 0;
  constructor() {}

  onItemClick(report, index) {
    this.activeIndex = index;
    this.selectionChanged.emit(report);
  }

  ngOnInit(): void {}
}
