import { RDLReportDefinition } from "@grapecity/activereports/core";
import { ReportDefinition } from "@grapecity/activereports/reportdesigner";

export type DesignerMode = "designer";
export type ViewerMode = "viewer";

export type AppMode = DesignerMode | ViewerMode;

export type ReportDescriptior = {
  label: string;
  url: string;
  definition?: RDLReportDefinition;
  paginated: boolean;
};

export type UseDesignerProps = {
  report: ReportDescriptior;
  onRender: (report: ReportDefinition) => Promise<void>;
  hostElem: any;
};

export type ViewerProps = {
  report: ReportDescriptior;
  onEdit: () => void;
};

export type ListProps = {
  title: string;
  items: string[];
  currentItemIndex?: number;
  selectionChanged: (index: number) => void;
};
