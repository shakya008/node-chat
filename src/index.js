var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
var sockets = {};
io.on('connection', function(socket){
  console.log('a user connected');
  var ip = socket.handshake.address;
  fs.appendFile ('./ip.txt', ip + "\n", function(err) {
        if (err) throw err;
        console.log(ip);
    });
  sockets[ip] = socket;
  fs.readFile('./data.txt', 'utf8', function (err, data) {
    if (err) throw err;
    socket.emit('chat message', data);
});

  socket.on('chat message', function(msg){
      console.log(msg);
      var chat = "<p>" + ip + " : " + msg + "</p>";
      fs.appendFile ('./data.txt', chat, function(err) {
        if (err) throw err;
        console.log('complete');
    });
      io.emit('chat message', chat);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
