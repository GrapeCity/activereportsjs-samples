import React, { useCallback } from "react";
import { ReportDescriptior, UseDesignerProps } from "../types";
import { Designer as ReportDesigner } from "@grapecity/activereports/reportdesigner";

export const useDesigner = ({
  report,
  onRender,
  hostElem,
}: UseDesignerProps) => {
  const designer = React.useRef<ReportDesigner>();

  const reportUri: (report: ReportDescriptior) => any = useCallback(
    (report) =>
      report.definition
        ? { reportDefinition: report.definition, displayName: report.label }
        : { id: report.url, displayName: report.label },
    []
  );

  React.useEffect(() => {
    designer.current = designer.current || new ReportDesigner(hostElem);
  }, [hostElem]);

  React.useEffect(() => {
    designer.current?.setActionHandlers({ onRender });
  }, [onRender]);

  React.useEffect(() => {
    designer.current?.setReport(reportUri(report));
  }, [report, reportUri]);
};
