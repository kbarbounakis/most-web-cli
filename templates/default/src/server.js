var web = require('most-web');
/**
 * start application
 */
web.current.start({
    port:process.env.PORT ? process.env.PORT: 3000,
    bind:process.env.IP || '127.0.0.1'
});
