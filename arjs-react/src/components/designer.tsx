import { Designer as ReportDesigner } from "@grapecity/activereports-react";
import { DesignerProps, ReportDescriptior } from "../types";

const reportUri: (report: ReportDescriptior) => any = (report) =>
  report.definition
    ? { definition: report.definition, displayName: report.label }
    : { id: report.url, displayName: report.label };

export const Designer = ({ report, onRender }: DesignerProps) => {
  return (
    <ReportDesigner
      report={reportUri(report)}
      onRender={onRender}
    ></ReportDesigner>
  );
};
