import dbMethods from './connectDB.js';
await dbMethods.connectDB()

import readline from 'readline'
import { io } from 'socket.io-client'
import { encrypt, decrypt } from './encryption.js'
import { User } from "./models/user.model.js"
import bcrypt from "bcryptjs";
import { PrivateMessage } from "./models/djMessage.model.js"

const socket = io('http://localhost:3000');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let username;
let target = null;

const loadChatHistory = async () => {
  const history = await PrivateMessage.find({
    $or: [
      { from: username, to: target },
      { to: username, from: target }
    ]
  }).sort("timestamp")

  history.map(message => {
    console.log(`${message.from === username ? "You" : message.from} : ${decrypt(message.message)}\n`)
  })
}

socket.on('receive_private_message', ({ from, message }) => {
  const decrypted = decrypt(message);
  console.log(`\n[PRIVATE] ${from}: ${decrypted}`);
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
    rl.question('Enter username to chat with: ', (user) => {
      target = user;

      loadChatHistory()
      promptInput();
    });
  });
});

function promptInput() {
  rl.question(`${target} => `, async (msg) => {
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

    promptInput();
  });
}