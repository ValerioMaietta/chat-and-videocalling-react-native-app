// SocketContext.js
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useRef,
} from 'react';
import SocketIOClient from 'socket.io-client';
import {
  RTCPeerConnection,
  RTCSessionDescription,
  RTCIceCandidate,
  mediaDevices,
} from 'react-native-webrtc'; // Assicurati che questa libreria sia installata
import InCallManager from 'react-native-incall-manager'; // Assicurati che questa libreria sia installata

const SocketContext = createContext();

export const SocketProvider = ({
  children,
  userId,
  onNewCall,
  onEndCall,
  onIncomingCall,
}) => {
  const [callData, setCallData] = useState(null);
  const [answeredCallData, setAnsweredCallData] = useState(null);
  const [iceCandidates, setIceCandidates] = useState([]);

  const [localStream, setlocalStream] = useState(null);

  const [remoteStream, setRemoteStream] = useState(null);

  const [callerId, setCallerId] = useState(null);

  useEffect(() => {
    if (userId) {
      setCallerId(userId);
    }
  }, [userId]);

  const socket = SocketIOClient('http://<insert_here_your_ip_address>:3500', {
    transports: ['websocket'],
    query: {
      callerId: userId,
    },
  });

  const otherUserId = useRef(null);

  const [localMicOn, setlocalMicOn] = useState(true);

  const [localWebcamOn, setlocalWebcamOn] = useState(true);

  //useRef è un hook di react che ci permette di avere un riferimento che può essere assegnato
  //ad elementi del DOM; di base, infatti, react utilizza il virtual DOM quindi non potremmo interagire
  //direttamente con questi elementi.

  const peerConnection = useRef(
    new RTCPeerConnection({
      //stabilisce una connessione tra il computer locale e un peer remoto
      iceServers: [
        //lista di server ICE pubblici utilizzati per l'attraversamento del NAT
        {
          urls: 'stun:stun.l.google.com:19302',
        },
        {
          urls: 'stun:stun1.l.google.com:19302',
        },
        {
          urls: 'stun:stun2.l.google.com:19302',
        },
      ],
    }),
  );

  let remoteRTCMessage = useRef(null);

  //evento generato quando qualcuno vuole stabilire una chiamata con me
  useEffect(() => {
    socket.on('newCall', data => {
      //.current assegna un valore al riferimento creato con useRef
      remoteRTCMessage.current = data.rtcMessage;
      otherUserId.current = data.callerId;
      if (onIncomingCall) {
        onIncomingCall();
      }
    });

    //evento generato quando il peer remoto accetta la chiamata
    socket.on('callAnswered', data => {
      remoteRTCMessage.current = data.rtcMessage;
      //setto i parametri di negoziazione
      peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(remoteRTCMessage.current),
      );
      if (onNewCall) {
        onNewCall();
      }
    });

    //scambio dei candidati
    socket.on('ICEcandidate', data => {
      let message = data.rtcMessage;

      if (peerConnection.current) {
        peerConnection?.current
          .addIceCandidate(
            //aggiungo l'ogetto ICEcandidate ricevuto tramite socket
            new RTCIceCandidate({
              candidate: message.candidate,
              sdpMid: message.id,
              sdpMLineIndex: message.label,
            }),
          )
          .then(data => {
            console.log('SUCCESS');
          })
          .catch(err => {
            console.log('Error', err);
          });
      }
    });

    let isFront = false;

    //ricerco la videocamera per il dispositivo connesso
    mediaDevices.enumerateDevices().then(sourceInfos => {
      let videoSourceId;
      for (let i = 0; i < sourceInfos.length; i++) {
        const sourceInfo = sourceInfos[i];
        if (
          sourceInfo.kind == 'videoinput' &&
          sourceInfo.facing == (isFront ? 'user' : 'environment')
        ) {
          videoSourceId = sourceInfo.deviceId;
        }
      }

      mediaDevices
        .getUserMedia({
          //richiede i permessi
          audio: true,
          video: {
            mandatory: {
              minWidth: 500,
              minHeight: 300,
              minFrameRate: 30,
            },
            facingMode: isFront ? 'user' : 'environment', //user è la fotocamera anteriore, enviroment posteriore
            //optional: videoSourceId ? [{sourceId: videoSourceId}] : [],
          },
        })
        .then(stream => {
          setlocalStream(stream);

          // setup stream listening
          peerConnection.current.addStream(stream);
        })
        .catch(error => {
          // Log error
        });
    });

    peerConnection.current.onaddstream = event => {
      setRemoteStream(event.stream);
    };

    //listner che viene invocato ogni qual volta viene trovato un candidato
    peerConnection.current.onicecandidate = event => {
      if (event.candidate) {
        sendICEcandidate({
          calleeId: otherUserId.current,
          rtcMessage: {
            label: event.candidate.sdpMLineIndex,
            id: event.candidate.sdpMid,
            candidate: event.candidate.candidate,
          },
        });
      } else {
        console.log('End of candidates.');
      }
    };

    return () => {
      socket.off('newCall');
      socket.off('callAnswered');
      socket.off('ICEcandidate');
    };
  }, []);

  //https://github.com/react-native-webrtc/react-native-incall-manager per l'handle dell'audio.
  useEffect(() => {
    InCallManager.start();
    InCallManager.setKeepScreenOn(true);
    InCallManager.setForceSpeakerphoneOn(true);

    return () => {
      InCallManager.stop();
    };
  }, []);

  function sendICEcandidate(data) {
    socket.emit('ICEcandidate', data);
  }

  //crea un'offerta SDP, la imposta come local description nell'oggetto RTCPeerConnection,
  //e quindi invia questa offerta a un altro peer per iniziare il processo di negoziazione
  //di una chiamata WebRTC

  async function processCall() {
    const sessionDescription = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(sessionDescription);
    console.log('sono in setLocalDescriptions');
    sendCall({
      calleeId: otherUserId.current,
      rtcMessage: sessionDescription,
    });
  }

  //duale di quello di prima, per le chiamate in entrata.

  async function processAccept() {
    peerConnection.current.setRemoteDescription(
      new RTCSessionDescription(remoteRTCMessage.current),
    );
    console.log('sono in setRemoteDescriptions');
    const sessionDescription = await peerConnection.current.createAnswer();
    await peerConnection.current.setLocalDescription(sessionDescription);
    answerCall({
      callerId: otherUserId.current,
      rtcMessage: sessionDescription,
    });
  }

  function answerCall(data) {
    socket.emit('answerCall', data);
  }

  function sendCall(data) {
    socket.emit('call', data);
  }

  function switchCamera() {
    localStream.getVideoTracks().forEach(track => {
      track._switchCamera();
    });
  }

  function toggleCamera() {
    localWebcamOn ? setlocalWebcamOn(false) : setlocalWebcamOn(true);
    localStream.getVideoTracks().forEach(track => {
      localWebcamOn ? (track.enabled = false) : (track.enabled = true);
    });
  }

  function toggleMic() {
    localMicOn ? setlocalMicOn(false) : setlocalMicOn(true);
    localStream.getAudioTracks().forEach(track => {
      localMicOn ? (track.enabled = false) : (track.enabled = true);
    });
  }

  function leave() {
    //peerConnection.current.close();
    //setlocalStream(null);
    localStream.getAudioTracks().forEach(track => {
      track.enabled = false;
    });
    if (onEndCall) {
      onEndCall();
    }
  }

  return (
    <SocketContext.Provider
      value={{
        socket,
        callerId,
        callData,
        otherUserId,
        answeredCallData,
        iceCandidates,
        localStream,
        remoteStream,
        localMicOn,
        localWebcamOn,
        sendICEcandidate,
        processCall,
        processAccept,
        switchCamera,
        toggleCamera,
        toggleMic,
        leave,
      }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
