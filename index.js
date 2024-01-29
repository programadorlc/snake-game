const express = require('express');
const http = require('http');
const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const port = 3000;

app.use(express.static(path.join(__dirname, 'src')));
app.use(express.static(path.join(__dirname, 'src/css')));
app.use(express.static(path.join(__dirname, 'src/js')));
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/src/');
});

// Função para observar alterações no arquivo HTML
function watchHtml() {
  const filePath = __dirname + '/src/index.html';

  chokidar.watch(filePath).on('change', () => {
    console.log('Arquivo HTML alterado. Atualizando página...');
    broadcastReload();
  });
}

function watchCss() {
  const filePath = __dirname + '/src/css/style.css';

  chokidar.watch(filePath).on('change', () => {
    console.log('Arquivo CSS alterado. Atualizando página...');
    broadcastReload();
  });
}

function watchJs() {
  const filePath = __dirname + '/src/js/main.js';

  chokidar.watch(filePath).on('change', () => {
    console.log('Arquivo JS alterado. Atualizando página...');
    broadcastReload();
  });
}

// Emite uma mensagem de recarregamento para todos os clientes conectados
function broadcastReload() {
  io.emit('reload');
}

// Configuração do Socket.IO
io.on('connection', (socket) => {
  console.log('Cliente conectado');

  // Evento para lidar com o fechamento da conexão
  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
})

// Inicia a observação de alterações no arquivo HTML
watchHtml();
watchCss();
watchJs();