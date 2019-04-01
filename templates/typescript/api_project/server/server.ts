import {HttpApplication} from '@themost/web/app';
import {resolve} from 'path';
import {TraceUtils} from '@themost/common/utils';
import {LocalizationStrategy, I18nLocalizationStrategy} from '@themost/web/localization';
import {ODataModelBuilderConfiguration} from '@themost/web/odata';
// initialize app
let app = new HttpApplication(resolve(__dirname));
// set static content
app.useStaticContent(resolve('./app'));
// use i18n localization strategy
app.useStrategy(LocalizationStrategy, I18nLocalizationStrategy);
// configure api
ODataModelBuilderConfiguration.config(app).then((builder)=> {
    builder.hasContextLink(() => {
        return '/api/$metadata';
    });
}).catch((err)=> {
    TraceUtils.error(err);
});
module.exports = app;
