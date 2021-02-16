import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesignerComponent } from './activereports-designer/activereports-designer.component';

@NgModule({
  declarations: [DesignerComponent],
  imports: [CommonModule],
  exports: [DesignerComponent],
})
export class GcModule {}
