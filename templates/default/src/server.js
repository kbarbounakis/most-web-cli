/**
 * Created by Kyriakos Barbounakis<k.barbounakis@gmail.com> on 20/11/2014.
 */
var path = require('path'),
    express = require('express'),
    web = require('most-web');

//init web server
var app = express();
//view engine setup
app.set('views', path.join(__dirname, 'app/views/pages'));
app.set('view engine', 'ejs');
//most web framework runtime
app.use(web.runtime());
//development environment setup
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        //log error
        console.log(err.message);
        if (err.stack) {
            console.log(err.stack);
        }
        //render error
        res.set('X-Status-Description',  err.message);
        res.set('Content-Type',  'text/plain');
        res.status(err.status || 500);
        res.send((err.status || 500).toString() + ' ' + err.message + '\n' + err.stack);
    });
}
/**
 * web application unauthorized access
 */
//catch 401 and forward to login page or error handler
//app.use(web.unauthorized());

/**
 * web server startup
 */

var port = process.env.PORT ? process.env.PORT: 3000,
    ip = process.env.IP || '0.0.0.0',
    server = app.listen(port, ip, function(){
    console.log('Express server listening on port ' + server.address().port);
});