import React, { useCallback } from "react";
import { Designer as ReportDesigner } from "@grapecity/activereports-react";
import { DesignerProps, ReportDescriptior } from "../types";

export const Designer = ({ report, onRender }: DesignerProps) => {
  const counter = React.useRef<number>(0);
  const reportUri: (report: ReportDescriptior) => any = useCallback(
    (report) =>
      report.definition
        ? { reportDefinition: report.definition, displayName: report.label }
        : { id: report.url, displayName: report.label },
    []
  );
  React.useEffect(() => {
    console.log(reportUri(report));
  }, [report, reportUri]);

  const onSave = (saveOptions: any) => {
    console.log("onSave fired");
    return Promise.resolve({
      displayName: saveOptions.displayName || "Untitled",
    });
  };
  const onSaveAs = (saveAsOptions: any) => {
    console.log("onSaveAs fired");
    counter.current = counter.current + 1;
    return Promise.resolve({
      id: `Report${counter.current}`,
      displayName: saveAsOptions.displayName || `Report${counter.current}`,
    });
  };

  return (
    <ReportDesigner
      report={reportUri(report)}
      onRender={onRender}
      onSave={onSave}
      onSaveAs={onSaveAs}
    ></ReportDesigner>
  );
};
