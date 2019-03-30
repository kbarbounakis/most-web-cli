import createError from 'http-errors';
import express from 'express';
import engine from 'ejs-locals';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import sassMiddleware from 'node-sass-middleware';
import { ExpressDataApplication, serviceRouter, dateReviver } from '@themost/express';
import indexRouter from './routes/index';

let app = express();

// use ejs-locals for all ejs templates
app.engine('ejs', engine);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));

app.use(express.json({
  reviver: dateReviver 
}));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// @themost/data data application setup
const dataApplication = new ExpressDataApplication(path.resolve(__dirname, 'config'));
// hold data application
app.set('ExpressDataApplication', dataApplication);
// use data middleware (register req.context)
app.use(dataApplication.middleware());
// use sass middleware
app.use(sassMiddleware({
  src: path.join(process.cwd(), 'public'),
  dest: path.join(process.cwd(), 'public'),
  indentedSyntax: false, // true = .sass and false = .scss
  sourceMap: true
}));
// use static content
app.use(express.static(path.join(process.cwd(), 'public')));

app.use('/', indexRouter);
// use @themost/express service router
app.use('/api', serviceRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || err.statusCode || 500);
  res.render('error');
});

module.exports = app;
