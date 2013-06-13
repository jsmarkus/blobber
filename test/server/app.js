var path = require('path');
var express = require('express');
var app = express();
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '../../')));
app.use(express.errorHandler());

app.listen(3000);
console.log('Listening on port 3000');

app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.post('/in', function (req, res) {
    var file = req.files.attachment;
    if(file) {
        res.json(200, {
            size : file.size,
            name : file.name,
            type : file.type
        });
    } else {
        res.json(400, {err:'bad_request'});
    }
    console.log(req.files.attachment.toJSON());
});

app.post('/in/404', function (req, res) {
    res.send(404);
});

app.post('/in/break', function (req, res) {
    res.socket.destroy();
});

app.get('/out/break', function (req, res) {
    res.socket.destroy();
});