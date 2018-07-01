import {HttpApplication} from '@themost/web/app';
import {resolve} from 'path';
import {TraceUtils} from '@themost/common/utils';
import {AngularServerModule} from "@themost/web/angular/module";
import {LocalizationStrategy, I18nLocalizationStrategy} from "@themost/web/localization";
import {ODataModelBuilderConfiguration} from "@themost/web/odata";
//initialize app
let app = new HttpApplication(resolve(__dirname));
//set static content
app.useStaticContent(resolve('./app'));
//use i18n localization strategy
app.useStrategy(LocalizationStrategy, I18nLocalizationStrategy);
//configure api
ODataModelBuilderConfiguration.config(app).then((builder)=> {
    builder.hasContextLink((context)=> {
        return '/api/$metadata';
    });
}).catch((err)=> {
    TraceUtils.error(err);
});
//start http application
app.start({
    port: process.env.PORT ? process.env.PORT: 3000,
    bind: process.env.IP || '0.0.0.0'
});
