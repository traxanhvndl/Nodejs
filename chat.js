var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var ip = '192.168.35.44';
var port = 4000;

server.listen(port, ip, function(){
    console.log("Server is running on ["+ip+":"+port+"]")
});
app.get('/',function (req, res) {
    res.sendFile(__dirname + '/chat.html')
});

var rooms = ['room1', 'room2', 'room3', 'room4'];
var usernames = {};

io.sockets.on('connection', function (socket) {
    socket.on('adduser', function(username) {
        console.log(username + ' logged in !');
        socket.username = username;
        socket.room = 'room1';
        usernames[username] = usernames;
        socket.join('room1');
        socket.emit('updatechat', 'Server', 'you join room1');
        socket.broadcast.to('room1').emit('updatechat', 'Server', username + ' connect to this room');
        socket.emit('updaterooms', rooms, 'room1');
    });

    socket.on('senchat', function(message) {
        console.log(message);
        io.sockets.in(socket.room).emit('updatechat', socket.username, message);
    });

    socket.on('changeRoom', function(newroom) {
        console.log(newroom);
        socket.leave(socket.room);
        socket.join(newroom);
        socket.emit('updatechat', 'Server', 'you join to '+ newroom);
        // old room
        socket.broadcast.to(socket.room).emit('updatechat', 'Server', socket.username + ' has left this room !');
        socket.room = newroom;
        socket.broadcast.to(socket.room).emit('updatechat', 'Server', socket.username + ' join this room !');
        socket.emit('updaterooms', rooms, newroom);
    });
    
});