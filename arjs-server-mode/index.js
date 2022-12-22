const chromium = require("playwright").chromium;
const fs = require("fs");
const path = require("path");
const express = require("express");
const app = express();

app.use(express.static(path.join(__dirname, "resources")));
app.use("/scripts", express.static(path.join(__dirname, "node_modules", "@grapecity" , "activereports" ,"dist")));

app.listen(9999);

(async () => {
  const browser = await chromium.launch({
    headless: true,
    args: ["--font-render-hinting=none"],
  });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(`http://localhost:9999/index.html`);

  const pdfString = await page.evaluate(
    ({ reportUrl, categories }) =>
      new Promise(async (resolve, reject) => {
        // GC.ActiveReports.Core.setLicenseKey(<INSERT YOUR DISTRIBUTION KEY HERE>)
        await GC.ActiveReports.Core.FontStore.registerFonts("fontsConfig.json");
        const report = new GC.ActiveReports.Core.PageReport();
        await report.load(reportUrl);
        report.parameters["DisplayedCategories"].values = categories;
        await report.resolveParametersValues();
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
    { reportUrl: "ProductsList.rdlx-json", categories: [2, 4, 5, 6] }
  );

  const pdfData = Buffer.from(pdfString, "binary");
  const pdfPath = path.join(__dirname, "ProductsList.pdf");
  fs.writeFileSync(pdfPath, pdfData);
  console.log(`The report was exported to ${pdfPath}`);
  process.exit(0);
})();
