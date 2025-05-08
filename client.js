const readline = require('readline');
const { io } = require('socket.io-client');
const { encrypt, decrypt } = require('./encryption');

const socket = io('http://localhost:3000');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let username;
let mode = null;
let target = null;

socket.on('receive_private_message', ({ from, message }) => {
  const decrypted = decrypt(message);
  console.log(`\n[PRIVATE] ${from}: ${decrypted}`);
  promptInput();
});

socket.on('receive_room_message', ({ from, message }) => {
  const decrypted = decrypt(message);
  console.log(`\n[ROOM] ${from}: ${decrypted}`);
  promptInput();
});

rl.question('Enter your username: ', (name) => {
  username = name;
  socket.emit('register', username);
  chooseMode();
});

function chooseMode() {
  rl.question('\nChoose chat mode:\n1) Private chat\n2) Room chat\n> ', (choice) => {
    if (choice === '1') {
      mode = 'private';
      rl.question('Enter username to chat with: ', (user) => {
        target = user;
        promptInput();
      });
    } else if (choice === '2') {
      mode = 'room';
      rl.question('Enter room name: ', (room) => {
        target = room;
        socket.emit('join_room', room);
        promptInput();
      });
    } else {
      console.log('Invalid choice.');
      chooseMode();
    }
  });
}

function promptInput() {
  rl.question(`${mode === 'private' ? `[${target}]` : `[${target} Room]`} > `, (msg) => {
    if (msg.trim().toLowerCase() === '/menu') {
      mode = null;
      target = null;
      chooseMode();
      return;
    }

    if (mode === 'private') {
      socket.emit('send_private_message', {
        to: target,
        message: encrypt(msg),
      });
    } else if (mode === 'room') {
      socket.emit('send_room_message', {
        room: target,
        message: encrypt(msg),
      });
    }

    promptInput();
  });
}