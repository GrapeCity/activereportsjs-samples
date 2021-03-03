import React, { useCallback } from "react";
import {
  Viewer as ReportViewer,
} from "@grapecity/activereports-react";
import "@grapecity/activereports/pdfexport";
import "@grapecity/activereports/htmlexport";
import "@grapecity/activereports/xlsxexport";
import { ReportDescriptior, ViewerProps } from "../types";


export const Viewer = ({ report, onEdit}: ViewerProps) => {
  const ref = React.useRef<ReportViewer>(null);
  
  const reportUri: (report: ReportDescriptior)=>any = useCallback(report=>report.definition || report.url, []);

  React.useEffect(() => {
    const viewerInstance = ref.current?.Viewer;
    if (!viewerInstance) return;
    // Adding a toolbar item
    viewerInstance.toolbar.addItem({
      key: "$openDesigner",
      text: "Edit in Designer",
      iconCssClass: "mdi mdi-pencil",
      enabled: true,
      action: () => onEdit(),
    });
    // Setting the toolbar layout
    viewerInstance.toolbar.updateLayout({
      default: [
        "$openDesigner",
        "$split",
        "$navigation",
        "$split",
        "$refresh",
        "$split",
        "$history",
        "$split",
        "$zoom",
        "$fullscreen",
        "$split",
        "$print",
        "$split",
        "$singlepagemode",
        "$continuousmode",
        "$galleymode",
      ],
    });
  }, [onEdit]);

  React.useEffect(()=>{
    if(ref.current){
      ref.current.Viewer.renderMode = report.paginated ? "Paginated" :  "Galley";
      ref.current.Viewer.open(reportUri(report));
    }
  }, [report.definition, report.url, reportUri]);

  return <ReportViewer ref={ref}  />;
};
