import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-theme-selector',
  templateUrl: './theme-selector.component.html',
  styleUrls: ['./theme-selector.component.css'],
})
export class ThemeSelectorComponent implements OnInit {
  @Output() themeChanged = new EventEmitter<string>();
  @Input() themeList: any = [];
  activeIndex = 0;

  constructor() {}

  onThemeChanged(theme: any, index: number) {
    this.activeIndex = index;
    this.themeChanged.emit(theme.class);
  }

  ngOnInit(): void {}
}
