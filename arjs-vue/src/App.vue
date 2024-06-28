<template>
  <div id="app-host">
    <div id="list-host">
        <List
          title="Reports"
          v-bind:items="reportsList"
          v-bind:current-index="currentReportIndex"
          v-on:selectionChanged="updateReportIndex"
        />
    </div>

    <div id="report-host">
      <div id="viewer-host" v-show="previewMode">
        <ReportViewer ref="reportViewer" v-bind:availableExports = "availableExports"  />
      </div>
      <div id="designer-host" v-show="!previewMode">
        <ReportDesigner ref="reportDesigner" :onRender="onRender" />
      </div>
    </div>
  </div>
</template>

<script>
import { Viewer, Designer } from "@mescius/activereportsjs-vue";
// eslint-disable-next-line
import { TabularDataExport, XlsxExport, HtmlExport } from "@mescius/activereportsjs";
import List from "./components/List.vue";
import reports from "./assets/reports.json";

const reportLabels = reports.map((r) => r.label);

const reportsMap = reports.map((r) => ({ ...r, definition: undefined }));

export default {
  name: "App",
  components: {
    ReportViewer: Viewer,
    ReportDesigner: Designer,
    List,
  },
  data() {
    return {
      availableExports: ['pdf', 'html', 'tabular-data'],
      previewMode: true,
      reportsList: reportLabels,
      currentReportIndex: undefined,
      currentThemeIndex: undefined,
      reportsMap: reportsMap,
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
  },
  methods: {
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
  },
};
</script>

<style>

body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app-host {
  display: flex;
  height: 100vh;
}

#list-host {
  flex: 0 0 15%; 
  height: 100%; 
  background-color: #f1f1f1; 
  overflow-y: auto; 
}

#report-host {
  flex: 1; 
  height: 100%; 
  overflow-y: auto; 
}

#viewer-host, #designer-host {
  height: 100%; 
}

</style>
