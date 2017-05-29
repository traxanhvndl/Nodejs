var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var port = 3000;
var ip = '127.0.0.1';
app.use(bodyParser.json());

app.all('/api/security/*', [require('./security/validateRequest')]);

var auth = require('./security/auth.js');
app.post('/login', auth.login);

// body
app.get('/api/free/server1', function (req, res) {
    res.write('Free - server1');
    res.end();
});

app.get('/api/security/user/server1', function (req, res) {
    res.write('User - server1');
    res.end();
});

app.get('/api/security/admin/server1', function (req, res) {
    res.write('Admin - server1');
    res.end();
});

app.use(function(req, res, next) {
    var error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.listen(port, function() {
    console.log('Server listening on port : ' + port)
});