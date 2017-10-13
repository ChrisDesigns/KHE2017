var express = require('express');
var exphbs  = require('express-handlebars');

app = express();

app.use("/css", express.static(__dirname + '/css'));
app.use("/js", express.static(__dirname + '/js'));

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
var hbs = exphbs.create({
    dbdata: {
        LogStat: function () { return true; },
        pwds: function () { return ""; }
    }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');


app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

app.get('/pwd/', function(req, res){
    res.render('pwd', {
        dbdata: {
            LogStat: function () { return true; },
            pwds: function () { return ""; }
        }
    });
});


var server = require('http').createServer(app), io = require('socket.io').listen(server);


function validLogin(user, hash) {
    if (user == "chris" && hash == "e055f69401cae96228e84eda1e2854d8")
        return true;
}

io.sockets.on('connection', function (socket) {
    var ip = socket.request.connection.remoteAddress;
    ip = ip.substring(ip.lastIndexOf(":") + 1);

    socket.on('Login', function(UserInfo) {
        console.log(UserInfo);
        var UserArray = UserInfo.split(':');
        if (validLogin(UserArray[0], UserArray[1])) {
            socket.broadcast.emit("redirect", "/pwd/");
        } else {
            console.log(UserArray[0] + " failed to login.");
        }
    });

});

server.listen(8070);
console.log('Server is listening on port 8070...');

