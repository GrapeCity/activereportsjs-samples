import React, { useCallback } from "react";
import { List, Viewer, Designer } from "./components";
import { Core } from "@mescius/activereportsjs";
import { ReportDefinition } from "@mescius/activereportsjs/reportdesigner";
import { AppMode, ReportDescriptior } from "./types";
import "./App.css";
import reports from "./reports.json";
import "@mescius/activereportsjs/styles/ar-js-designer.css";
import "@mescius/activereportsjs/styles/ar-js-viewer.css";
import "@mescius/activereportsjs/styles/ar-js-ui.css";

Core.FontStore.registerFonts("fontsConfig.json");

export const App = () => {
  const reportMap = React.useRef<ReportDescriptior[]>(
    reports.map((report) => ({ ...report }))
  );
  const [mode, setMode] = React.useState<AppMode>("viewer");
  const [reportIndex, setReportIndex] = React.useState<number>(0);

  const handleOnRender = useCallback(
    (data: ReportDefinition): Promise<void> => {
      reportMap.current[reportIndex].definition = data.definition;
      setMode("viewer");
      return Promise.resolve();
    },
    [reportIndex]
  );

  return (
    <>
      <div id="app">
        <div id="list-host">
          <div className="flex-grow-1">
            <List
              title="Reports"
              items={reports.map((report) => report.label)}
              currentItemIndex={reportIndex}
              selectionChanged={(index) => setReportIndex(index)}
            />
          </div>
        </div>
        <div id="host">
          {mode === "designer" && (
            <div id="arjs-designer-host">
              <Designer
                report={reportMap.current[reportIndex]}
                onRender={handleOnRender}
              />
            </div>
          )}
          {mode === "viewer" && (
            <div id="arjs-viewer-host">
              <Viewer
                report={reportMap.current[reportIndex]}
                onEdit={() => setMode("designer")}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};
