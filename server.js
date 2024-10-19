const express = require('express');
const app = express();

// socket.io setup
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, { pingInterval: 2000, pingTimeout: 5000 });

const port = 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
});

const players = {};

io.on('connection', (socket) => {
  players[socket.id] = {};
  const player = players[socket.id];
  player.pseudo = "Anonymous";
  console.log(players);
  io.emit('newPlayer', players);
  console.log(`${socket.id} user connected`);
  // socket.on('input', (text)=>{
  //   console.log(text);
  // });
  socket.on('pseudoChoose', (pseudo)=>{
    player.pseudo = pseudo;
    io.emit('newPlayer', players);
  });

  socket.on('message', (text)=>{
    console.log("New chat: "+text);
    io.emit('newMessage', 
    {
      text: text, 
      sender: player.pseudo,
      // time: new Date()
    });
  });

  socket.on('disconnect', (reason) => {
    // console.log(reason)
    delete players[socket.id];
    io.emit('newPlayer', players);
  })
});

server.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

console.log('server did load')