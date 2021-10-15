<template>
  <div id="app" v-bind:class="currentThemeId()">
    <div v-html="styles"></div>
    <div id="list-host">
      <div class="flex-grow-1">
        <List
          title="Reports"
          v-bind:items="reportsList"
          v-bind:current-index="currentReportIndex"
          v-on:selectionChanged="updateReportIndex"
        />
      </div>
      <div class="flex-grow-0">
        <List
          title="Themes"
          v-bind:items="themeList"
          v-bind:current-index="currentThemeIndex"
          v-on:selectionChanged="updateThemeIndex"
        />
      </div>
    </div>

    <div id="host">
      <div id="viewer-host" v-show="previewMode">
        <ReportViewer ref="reportViewer" />
      </div>
      <div id="designer-host" v-show="!previewMode">
        <ReportDesigner ref="reportDesigner" :onRender="onRender" />
      </div>
    </div>
  </div>
</template>

<script>
import { Viewer, Designer } from "@grapecity/activereports-vue";
// eslint-disable-next-line
import { PdfExport, XlsxExport, HtmlExport } from "@grapecity/activereports";
import List from "./components/List.vue";
import reports from "./assets/reports.json";
import themes from "./assets/themes.json";

const reportLabels = reports.map((r) => r.label);

const reportsMap = reports.map((r) => ({ ...r, definition: undefined }));

const themeList = themes.map((theme) => theme.name);

export default {
  name: "App",
  components: {
    ReportViewer: Viewer,
    ReportDesigner: Designer,
    List,
  },
  data() {
    return {
      previewMode: true,
      reportsList: reportLabels,
      currentReportIndex: undefined,
      currentThemeIndex: undefined,
      reportsMap: reportsMap,
      themeList: themeList,
      styles: "",
    };
  },
  mounted() {
    const viewerInstance = this.$refs.reportViewer.Viewer();
    viewerInstance.toolbar.addItem({
      key: "$openDesigner",
      text: "Edit in Designer",
      iconCssClass: "mdi mdi-pencil",
      enabled: true,
      action: () => {
        this.previewMode = false;
      },
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
    this.updateReportIndex(0);
    this.updateThemeIndex(0);
  },
  methods: {
    applyTheme(themeId) {
      const designerCss = require(`!!raw-loader!@grapecity/activereports/styles/${themeId}-designer.css`)
        .default;

      const viewerCss = require(`!!raw-loader!@grapecity/activereports/styles/${themeId}-viewer.css`)
        .default;

      const commonCss = require(`!!raw-loader!@grapecity/activereports/styles/${themeId}-ui.css`)
        .default;
      this.styles = `<style>${designerCss}</style><style>${viewerCss}</style><style>${commonCss}</style>`;
    },
    getReportDesign() {
      const report = this.reportsMap[this.currentReportIndex];
      return report.definition
        ? { reportDefinition: report.definition, displayName: report.label }
        : { id: report.url, displayName: report.label };
    },
    getReportPreview() {
      const report = this.reportsMap[this.currentReportIndex];
      return report.definition || report.url;
    },
    onRender(data) {
      this.reportsMap[this.currentReportIndex].definition = data.definition;
      this.$refs.reportViewer.Viewer().open(this.getReportPreview());
      this.previewMode = true;
      return Promise.resolve();
    },
    updateReportIndex(index) {
      this.currentReportIndex = index;
      this.$refs.reportViewer.open(this.getReportPreview());
      this.$refs.reportDesigner.setReport(this.getReportDesign());
    },
    currentThemeId() {
      return themes[this.currentThemeIndex || 0].id;
    },
    updateThemeIndex(index) {
      this.currentThemeIndex = index;
      this.applyTheme(this.currentThemeId());
    },
  },
};
</script>

<style>
@import "https://cdn.materialdesignicons.com/2.8.94/css/materialdesignicons.min.css";
</style>

<style>
body {
  font-size: 1rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
  padding: 0;
  margin: 0;
}

#app {
  display: flex;
  flex-direction: row;
  height: 100vh;
  font-size: 16px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
  padding: 0;
  margin: 0;
}

#list-host {
  display: flex;
  flex-direction: column;
  flex: 0 0 auto;
  height: 100%;
  background-color: #f1f1f1;
  overflow: hidden;
}

.dark-yellow #list-host {
  background-color: #3b3c3f;
  color: #e6e6e6;
}

#host {
  flex: 1 1 auto;
}

#designer-host,
#viewer-host {
  height: 100%;
}

.flex-grow-1 {
  flex-grow: 1;
}

.flex-grow-0 {
  flex-grow: 0;
}

.hidden {
  display: none;
}
</style>
