import React from "react";
import { useState } from "react";

export const useThemes = (
  themes: { id: string; name: string }[]
): [number, React.Dispatch<number>, Array<any>] => {
  const [themeIndex, setThemeIndex] = useState<number>(0);
  const [themeCss, setThemeCss] = useState<string[]>([]);
  React.useEffect(() => {
    const applyTheme = async () => {
      const designer = import(
        `!!raw-loader!@grapecity/activereports/styles/${themes[themeIndex].id}-designer.css`
      );
      const viewer = import(
        `!!raw-loader!@grapecity/activereports/styles/${themes[themeIndex].id}-viewer.css`
      );
      const ui = import(
        `!!raw-loader!@grapecity/activereports/styles/${themes[themeIndex].id}-ui.css`
      );
      const styles = await Promise.all([designer, viewer, ui]);
      setThemeCss(styles.map((style) => style.default || ""));
    };
    applyTheme();
  }, [themeIndex, themes]);
  return [themeIndex, setThemeIndex, themeCss];
};
