import React, { useCallback } from "react";
import { List, Viewer, Designer } from "./components";
import { Core } from "@grapecity/activereports";
import { ReportDefinition } from "@grapecity/activereports/reportdesigner";
import { AppMode, ReportDescriptior } from "./types";
import "./App.css";
import themes from "./themes.json";
import reports from "./reports.json";
import { useThemes } from "./hooks";
import "@grapecity/activereports/styles/ar-js-designer.css";
import "@grapecity/activereports/styles/ar-js-viewer.css";
import "@grapecity/activereports/styles/ar-js-ui.css";

Core.FontStore.registerFonts("fontsConfig.json");

export const App = () => {
  const reportMap = React.useRef<ReportDescriptior[]>(
    reports.map((report) => ({ ...report }))
  );
  const [mode, setMode] = React.useState<AppMode>("viewer");
  const [themeIndex, setThemeIndex, themeCss] = useThemes(themes);
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
      <div id="app" className={themes[themeIndex].id}>
        <div id="list-host">
          <div className="flex-grow-1">
            <List
              title="Reports"
              items={reports.map((report) => report.label)}
              currentItemIndex={reportIndex}
              selectionChanged={(index) => setReportIndex(index)}
            />
          </div>
          <div className="flex-grow-0">
            <List
              title="Themes"
              items={themes.map((theme) => theme.name)}
              currentItemIndex={themeIndex}
              selectionChanged={(index) => setThemeIndex(index)}
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
      {themeCss.map((html, key) => (
        <style
          type="text/css"
          key={`ar-js-style-${key}`}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ))}
    </>
  );
};
