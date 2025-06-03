import dbMethods from './connectDB.js';
await dbMethods.connectDB()

import readline from 'readline'
import { io } from 'socket.io-client'
import { encrypt, decrypt } from './encryption.js'
import { User } from "./models/user.model.js"
import bcrypt from "bcryptjs";
import { PrivateMessage } from "./models/privateMessage.model.js"
import { RoomMessage } from "./models/roomMessage.model.js"

const socket = io('http://localhost:3000');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let username;
let mode = null;
let target = null;

const loadChatHistory = async () => {
  if (mode === "private") {
    const history = await PrivateMessage.find({
      $or: [
        { from: username, to: target },
        { to: username, from: target }
      ]
    }).sort("timestamp")

    history.map(message => {
      console.log(`${message.from === username ? "You" : message.from} : ${decrypt(message.message)}\n`)
    })
  } else if (mode === 'room') {
    const history = await RoomMessage.find({ room: target }).sort("timestamp")

    history.map(message => {
      console.log(`${message.from} : ${decrypt(message.message)}\n`)
    })
  }
}

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

rl.question('Enter your username: ', (uname) => {
  rl.question('Enter your password: ', async (pw) => {
    const user = await User.findOne({ username: uname })

    if (!user) {
      console.log("No user found for given username, creating one now...")
      const hash = await bcrypt.hash(pw, 10)
      const newUser = new User({ username: uname, password: hash })
      await newUser.save()
      console.log("New user registered, login to proceed")
      process.exit(0)
    }

    const isPasswordValid = bcrypt.compare(pw, user.password)

    if (!isPasswordValid) {
      console.log("Incorrect password!")
      process.exit(1)
    }

    username = uname;
    socket.emit('register', username);
    chooseMode();
  });
});

function chooseMode() {
  rl.question('\nChoose chat mode:\n1) Private chat\n2) Room chat\n> ', (choice) => {
    if (choice === '1') {
      mode = 'private';
      rl.question('Enter username to chat with: ', (user) => {
        target = user;

        loadChatHistory()
        promptInput();
      });
    } else if (choice === '2') {
      mode = 'room';
      rl.question('Enter room name: ', (room) => {
        target = room;

        loadChatHistory()
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
  rl.question(`${mode === 'private' ? `[${target}]` : `[${target} Room]`} > `, async (msg) => {
    if (msg.trim().toLowerCase() === '/menu') {
      mode = null;
      target = null;
      chooseMode();
      return;
    }

    if (mode === 'private') {
      const newPrivateMessage = new PrivateMessage({
        to: target,
        from: username,
        message: encrypt(msg)
      })

      await newPrivateMessage.save()

      socket.emit('send_private_message', {
        to: target,
        message: encrypt(msg),
      });
    } else if (mode === 'room') {
      const newRoomMessage = new RoomMessage({
        room: target,
        from: username,
        message: encrypt(msg)
      })

      await newRoomMessage.save()

      socket.emit('send_room_message', {
        room: target,
        message: encrypt(msg),
      });
    }

    promptInput();
  });
}