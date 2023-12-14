# chat-and-videocalling-react-native-app
The aim of this sample project is to create a mobile app that allows users to create chatrooms (using socketIO) and to make videocalls (using webrtc)

## Installation and usage

After cloning this repo, go to server folder, install the dependecies and run it:
```console
npm install
npm run start
```

Do the same for the client folder:
```console
npm install
npm run android
```

Before running the app, put you IP in the following files: ```Chat.js```, ```signIn.js```, ```signUp.js```, ```SocketProvider.js``` and create an env file for MongoDB in the server directory.
