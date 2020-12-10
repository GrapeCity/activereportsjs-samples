# ActiveReportsJS Styles Insulator

Currently, ActiveReportsJS has a known issue with the Report Designer component - its style can conflict with the hosting application styles.
We are trying to fix it as soon as possible, but in the meantime, you can use the workaround presented with this package.
It generates the insulated style for the report designer component so that it does not interfere with the hosting application styles.

First, ensure that the HTML element that hosts the report designer component has the unique CSS selector - ID or Class attributes are suitable for that.
The hosting element's declaration can look like this:

```html
<div id='designer-host'></div>
```

Check the [Report Designer Integration](https://www.grapecity.com/activereportsjs/docs/DeveloperGuide/ActiveReportsJSDesignerComponent/Integration) page for more information.

Then open the ```designer.scss``` file and replace the CSS selector on [line 3](https://github.com/GrapeCity/activereportsjs-samples/blob/73b77e124245dea05b329ff9dc5e235655e4dd91/arjs-style-insulator/designer.scss#L3) with the selector that you use in the application. For example, it could be ```#designer-host```

If you are using a non-default theme for the designer component, replace paths on lines [5](https://github.com/GrapeCity/activereportsjs-samples/blob/73b77e124245dea05b329ff9dc5e235655e4dd91/arjs-style-insulator/designer.scss#L5) and [8](https://github.com/GrapeCity/activereportsjs-samples/blob/73b77e124245dea05b329ff9dc5e235655e4dd91/arjs-style-insulator/designer.scss#L8)

Check [Designer Themes](https://www.grapecity.com/activereportsjs/docs/DeveloperGuide/ActiveReportsJSDesignerComponent/Themes) page for more information.

Run the following commands from the root folder of the package:

```bash
npm install
npm run build
```

or, if you are using yarn, 

```bash
yarn
yarn build
```

The new file ```designer.css``` will be generated in the same folder. 
Insert this file into your application's resources and use it instead of the default ```ar-js-ui.css``` and ```ar-js-designer.css``` 
