using ActiveReportsJS.ServerSide.NET.Models;
using Microsoft.Playwright;

// copied from the launch settings, but could be obtained programmatically
var appUrl = "http://localhost:63368";

var db = new NorthwindContext();
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles(new StaticFileOptions()
{
    ServeUnknownFileTypes = true
});



app.MapGet("/Products", () =>
{
    return from p in db.Products select new { p.ProductName, p.CategoryId, UnitPrice = p.Price, p.UnitsInStock, p.UnitsOnOrder, p.ReorderLevel };
});
app.MapGet("/Categories", () =>
{
    return from c in db.Categories select new { c.CategoryId, c.CategoryName };
});

var runApp = app.RunAsync();

using var playwright = await Playwright.CreateAsync();
await using var browser = await playwright.Chromium.LaunchAsync(new()
{
    Headless = true
});
var page = await browser.NewPageAsync();

await page.GotoAsync(appUrl);


var exportTask = page.EvaluateAsync(@"({reportUrl,categories, apiRoot}) => 
      new Promise(async (resolve, reject) => { 
        // GC.ActiveReports.Core.setLicenseKey(<INSERT YOUR DISTRIBUTION KEY HERE>)
        await GC.ActiveReports.Core.FontStore.registerFonts('fontsConfig.json');
        const reportDef = await (await fetch(reportUrl)).json();
        reportDef.DataSources[0].ConnectionProperties.ConnectString = 'endpoint=' + apiRoot;
        const report = new GC.ActiveReports.Core.PageReport();
        await report.load(reportDef);
        report.parameters['DisplayedCategories'].values = categories;
        await report.resolveParametersValues();
        const doc = await report.run();
        const result = await GC.ActiveReports.PdfExport.exportDocument(doc, {
          info: { author: 'GrapeCity' },
        });
        result.download();
        resolve();
      })", new { reportUrl = "ProductsList.rdlx-json", categories = new[] { 2, 4, 5, 6 }, apiRoot = appUrl });

var downloadTask = page.WaitForDownloadAsync();

Task.WaitAll(downloadTask, exportTask);

await downloadTask.Result.SaveAsAsync($"{DateTime.UtcNow.Subtract(DateTime.UnixEpoch).TotalSeconds}.Products.pdf");

var stopApp = app.StopAsync();

Task.WaitAll(runApp, stopApp);










