import {HttpApplication} from '@themost/web/app';
import path from 'path';

let app = new HttpApplication(path.resolve(__dirname));
//start http application
app.start({
    port:process.env.PORT ? process.env.PORT: 3000,
    bind:process.env.IP || '0.0.0.0'
});
