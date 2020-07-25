import {createUser, getUser, removeUser, getOnlineUsers} from '../users';

export const mainSocket = (io) =>
  io.on('connect', (socket) => {
    console.log('connect socket io');

    socket.on('join', ({name, roomId}, callback) => {
      console.log('join socket');

      if (name.length === 0 && roomId.length === 0) {
        return callback('error');
      }

      const {error, user} = createUser(socket.id, name, roomId);

      if (error) {
        return callback(error);
      }

      socket.join(user.room);

      // // const onlineUsers = getOnlineUsers(user.room);

      socket.emit('message', {
        user: 'admin',
        text: `${user.username}, witaj w pokoju: ${user.room}`,
      });
      socket.to(user.room).emit('message', {user: 'admin', text: `${user.username} has joined!`});
      // // io.in(user.room).emit('onlineUsers', {onlineUsers});

      callback();
    });

    // socket.on('sendMessage', ({text}, callback) => {
    //   const {room, username} = getUser(socket.id);

    //   socket.to(room).emit('message', {user: username, text: text});

    //   callback();
    // });

    socket.on('disconnect', () => {
      console.log('disconect!');
      const user = removeUser(socket.id);
      // const onlineUsers = getOnlineUsers(user.room);

      if (user) {
        // io.to(user.room).emit('message', {user: 'Admin', text: `${user.username}, wyszedł.`});
        // io.in(user.room).emit('onlineUsers', {onlineUsers});
      }
    });
  });