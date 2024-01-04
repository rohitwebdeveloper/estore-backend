const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require('cors');
// require("dotenv").config();
const port = process.env.PORT ;

//creating a server and intergrating it with socketio.
const app = express();
const httpServer = createServer(app);
app.use(cors());

const io = new Server(httpServer, {
  cors: { origin: '*', methods: ["GET", "POST"] }
});




app.get('/', (req, res) => {
  res.send("Hello This is a server");
})


const users = [];
let key = 0;
function userconnected(username, roomid, id) {
   key++;
  const user = { username, roomid, id, key };
  users.push(user);
  return user;
}

function displayconnecteduserinroom(roomid) {
  return users.filter(user => user.roomid === roomid);
}

function finduserleft(id) {
  return users.filter(user => user.id === id);
}

function finduserleftindex(id) {
  return users.findIndex(user => user.id === id);
}

function removeuser(index) {
  if (index === -1) {
    return users;
  } else {
    return users.splice(index, 1);
  }
}




io.on('connection', (socket) => {
  console.log("User connected");
  let username;
  let userroomid;
  socket.on('user_room_join', ({ user, room }) => {
    username = user;
    userroomid = room;
    userconnected(user, room, socket.id);

    let getuser = displayconnecteduserinroom(room);
    console.log(getuser);

    socket.join(room);

    io.in(room).emit('user_joined_greeting', user);
    io.in(room).emit('user_roomid', room);
    io.in(room).emit('users_in_room', getuser);

    socket.on('client_message', (clientmessage)=>{
      // console.log(`${user}: ${client_msg_input}, Time:${time}`);
      
      socket.broadcast.in(room).emit('server_message', clientmessage);
    })

  })


  socket.on('disconnect', () => {
    console.log("User disconnected");
    let userid = socket.id;
    let left_greeting = finduserleft(userid);

    io.in(userroomid).emit('user_left_greeting', left_greeting);

    let userleftindex = finduserleftindex(userid);
    removeuser(userleftindex);
    console.log(`${username} left room: ${userroomid}`);

    let userleave = displayconnecteduserinroom(userroomid);
    io.in(userroomid).emit('users_in_room', userleave);

  })

})





// Listing a server which we have created on the top.
httpServer.listen(port, () => {
  console.log(`The server is running on port ${port}`);
});