const chromium = require("playwright").chromium;
const fs = require("fs");
const node_static = require("node-static");
const http = require("http");
const path = require("path");

var file = new node_static.Server(path.resolve(__dirname, "resources"));

http
  .createServer(function (req, res) {
    file.serve(req, res);
  })
  .listen(9999);

(async () => {
  const browser = await chromium.launch({
    headless: true,
    args: ["--font-render-hinting=none"],
  });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(`http://localhost:9999/index.html`);

  const pdfString = await page.evaluate(
    ({ reportUrl }) =>
      new Promise(async (resolve, reject) => {
        await GC.ActiveReports.Core.FontStore.registerFonts("fontsConfig.json");
        const report = new GC.ActiveReports.Core.PageReport();
        await report.load(reportUrl);
        const doc = await report.run();
        const result = await GC.ActiveReports.PdfExport.exportDocument(doc, {
          info: { author: "GrapeCity" },
        });
        const reader = new FileReader();
        reader.readAsBinaryString(result.data);
        reader.onload = () => resolve(reader.result);
        reader.onerror = () =>
          reject("Error occurred while reading binary string");
      }),
    { reportUrl: "ProductsList.rdlx-json" }
  );

  const pdfData = Buffer.from(pdfString, "binary");
  fs.writeFileSync(`${__dirname}/ProductsList.pdf`, pdfData);
  console.log("done");
  process.exit(0);
})();
