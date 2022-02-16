import { Rdl } from "@grapecity/activereports/core";
import { ReportDefinition } from "@grapecity/activereports/reportdesigner";

export type DesignerMode = "designer";
export type ViewerMode = "viewer";

export type AppMode = DesignerMode | ViewerMode;

export type ReportDescriptior = {
  label: string;
  url: string;
  definition?: Rdl.Report;
  paginated: boolean;
};

export type DesignerProps = {
  report: ReportDescriptior;
  onRender: (report: ReportDefinition) => Promise<void>;
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
