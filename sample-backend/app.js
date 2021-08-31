const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
// const nunjucks = require('nunjucks');
const dotenv = require('dotenv');

const host = '';
const port = '';

dotenv.config();
// const indexRouter = require('./routes/index');
// const authRouter = require('./routes/auth');
// const { sequelize } = require('./models');

const app = express();
app.set('port', process.env.PORT || 8010);
// app.set('view engine', 'html');
// nunjucks.configure('views', {
//   express: app,
//   watch: true,
// });
// sequelize.sync({ force: false })
//   .then(() => {
//     console.log('데이터베이스 연결 성공');
//   })
//   .catch((err) => {
//     console.error(err);
//   });

const sessionMiddleware = session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
});

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(sessionMiddleware);

// app.use('/', indexRouter);
// app.use('/auth', authRouter);

app.use((req, res, next) => {
  const error =  new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기중');

  console.log(process);
  
  let serverMessages = [  
    `\x1b[34m ################################################################ \x1b[0m`,
    `\x1b[34m # \x1b[0m\x1b[5m The Safer Client Web Server \x1b[0m`,
    `\x1b[34m # \x1b[0m Server listening on \x1b[31m http://${host}:${port} \x1b[0m`,
    `\x1b[34m ################################################################ \x1b[0m`,
    `\x1b[34m # \x1b[0m Node.js version \x1b[34m | \x1b[31m ${process.version} \x1b[0m`,
    `\x1b[34m # \x1b[0m Pid             \x1b[34m | \x1b[31m ${process.pid} \x1b[0m`,
    `\x1b[34m ################################################################ \x1b[0m`,
  ];

  let serverMsg = serverMessages.join('\n')

  console.log(serverMsg);
});
