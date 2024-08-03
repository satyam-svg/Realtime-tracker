const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', function(socket) {
    console.log('New connection:', socket.id);

    socket.on('send-location', function(data) {
        console.log('Received location:', data);
        io.emit('receive-location', {
            id: socket.id,
            latitude: data.latitude,
            longitude: data.longitude
        });
    });

    socket.on('disconnect', function() {
        console.log('User disconnected:', socket.id);
        io.emit('user-disconnected', socket.id);
    });
});

app.get('/', function(req, res) {
    res.render('index');
});

server.listen(3000, function() {
    console.log('Server is running on port 3000');
});
