const { Server } = require('socket.io');
let IO;
let chatRooms = [];
const generateID = () => Math.random().toString(36).substring(2, 10);

module.exports.initIO = (httpServer) => {
  IO = new Server(httpServer);

  //viene creato questo middleware in cui ogni qualvolta viene stabilito l'handshake tra
  //due sockets, viene estratto il callerId
  IO.use((socket, next) => {
    if (socket.handshake.query) {
      let callerId = socket.handshake.query.callerId; //estraiamo il callerId
      socket.user = callerId;
      next();
    } else {
      next(new Error('Caller ID not provided'));
    }
  });

  //ascolto sull'evento connection
  IO.on('connection', (socket) => {
    console.log(socket.user, 'Connected');
    socket.join(socket.user);

    socket.on('createRoom', (roomName) => {
      socket.join(roomName);
      //aggiunge il nuovo gruppo all'array della chat
      chatRooms.unshift({ id: generateID(), roomName, messages: [] });
      console.log(chatRooms);
      IO.emit('roomsList', chatRooms);
    });

    socket.on('disconnect', () => {
      //socket.disconnect();
      console.log('A user disconnected');
    });

    socket.on('findRoom', (id) => {
      //Filtra l'array in base all'id
      let result = chatRooms.filter((room) => room.id == id);
      //Invia i messaggi all'app
      IO.emit('foundRoom', result[0].messages);
    });

    socket.on('newMessage', (data) => {
      const { room_id, message, user, timestamp } = data;
      //trova la stanza dove è stato inviato il messaggio

      let result = chatRooms.filter((room) => room.id == room_id);

      //crea la struttura dati per i messaggi
      const newMessage = {
        id: generateID(),
        text: message,
        user,
        time: `${timestamp.hour}:${timestamp.mins}`,
      };
      //modifica le chatrooms
      IO.to(result[0].roomName).emit('roomMessage', newMessage);
      result[0].messages.push(newMessage);

      IO.emit('roomsList', chatRooms);
      IO.emit('foundRoom', result[0].messages);
    });

    
    //con socket.on, passiamo due parametri: il primo è l'evento che stiamo ascoltando
    //in questo caso, call, il secondo un riferimento alla funzione che vogliamo creare.
    socket.on('call', (data) => {
      let calleeId = data.calleeId;
      let rtcMessage = data.rtcMessage;

      socket.to(calleeId).emit('newCall', {
        callerId: socket.user,
        rtcMessage: rtcMessage,
      });
    });

    socket.on('answerCall', (data) => {
      let callerId = data.callerId;
      rtcMessage = data.rtcMessage;

      socket.to(callerId).emit('callAnswered', {
        callee: socket.user,
        rtcMessage: rtcMessage,
      });
    });

    socket.on('ICEcandidate', (data) => {
      console.log('ICEcandidate data.calleeId', data.calleeId);
      let calleeId = data.calleeId;
      let rtcMessage = data.rtcMessage;
      console.log('socket.user emit', socket.user);

      socket.to(calleeId).emit('ICEcandidate', {
        sender: socket.user,
        rtcMessage: rtcMessage,
      });
    });
  });
};

module.exports.getIO = () => {
  if (!IO) {
    throw Error('IO not initilized.');
  } else {
    return IO;
  }
};

module.exports.chatRooms = chatRooms;
