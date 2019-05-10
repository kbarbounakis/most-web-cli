import {HttpApplication} from '@themost/web';
import path from 'path';
import {ODataModelBuilderConfiguration} from '@themost/web/odata';
import {TraceUtils} from '@themost/common/utils';
import {LocalizationStrategy, I18nLocalizationStrategy} from '@themost/web/localization';
// initialize app
let app = new HttpApplication(path.resolve(__dirname));
// set static content
app.useStaticContent(path.resolve('./app'));
// use i18n localization strategy as default localozation strategy
app.useStrategy(LocalizationStrategy, I18nLocalizationStrategy);
// configure api
ODataModelBuilderConfiguration.config(app).then((builder)=> {
    builder.hasContextLink((context)=> {
       return '/api/$metadata';
    });
}).catch((err)=> {
    TraceUtils.error(err);
});
module.exports = app;
