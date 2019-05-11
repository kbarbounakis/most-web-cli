import {HttpApplication} from '@themost/web/app';
import path from 'path';
import {LocalizationStrategy, I18nLocalizationStrategy} from '@themost/web/localization';
// initialize app
const app = new HttpApplication(path.resolve(__dirname));
// set static content
app.useStaticContent(path.resolve('./app'));
// use i18n localization strategy as default localization strategy
app.useStrategy(LocalizationStrategy, I18nLocalizationStrategy);
// export app
module.exports = app;
