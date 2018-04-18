import {HttpApplication} from '@themost/web/app';
import path from 'path';
import {ODataModelBuilderConfiguration} from '@themost/web/odata';
//initialize app
let app = new HttpApplication(path.resolve(__dirname));
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
    port:process.env.PORT ? process.env.PORT: 3000,
    bind:process.env.IP || '0.0.0.0'
});
