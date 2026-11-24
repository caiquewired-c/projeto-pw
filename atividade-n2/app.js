const express = require('express');
const path = require('path');
const session = require('express-session');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'chave-secreta-forum-pw', resave: false, saveUninitialized: false }));
app.use((req, res, next) => { res.locals.usuario = req.session.usuario || null; next(); });

app.use('/', require('./routes/index'));
app.use('/', require('./routes/auth'));
app.use('/api', require('./routes/api'));

app.listen(3000, () => console.log('Servidor rodando em http://localhost:3000'));
