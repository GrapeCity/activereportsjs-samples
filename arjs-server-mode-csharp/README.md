# Using ActiveReportJS with C#

This sample demonstrates how to use ActiveReportsJS with C# to generate a PDF report on the server side. 
The code shows the following techniques:
* Starting a local web-app that hosts the static files and the data API
* Running a headless browser by using the [Playwright library](https://playwright.dev/dotnet/docs/library)
* Loading a page containing references to ActiveReportsJS scripts and executing the code that runs and exports the report
* Supplying report data via the API that is implemented within the application

After restoring the project dependencies, ensure to follow the steps described on the [Playwright documentation](https://playwright.dev/dotnet/docs/library):

```bash
# Install required browsers - replace netX with actual output folder name, e.g. net6.0.
pwsh bin/Debug/netX/playwright.ps1 install
```

After running the code, you will find a pdf file in the root directory of the application.

Please note that this approach requires a [single domain license](https://www.grapecity.com/activereportsjs/pricing).