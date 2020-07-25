import { useEffect, useContext, useState, useRef, RefObject } from 'react';
import io from 'socket.io-client';

import { joinContext } from 'context/joinContext';
import useAuthentication from 'authentication/authenticationHooks';

interface messageObject {
  isReceived: boolean;
  senderName: string;
  content: string;
}

let socket: any;
let URL: string;

if (window.location.hostname === 'localhost') {
  URL = 'http://localhost:5500/';
} else {
  URL = 'https://real-time-chat-backend.herokuapp.com/';
}

const useChatConnection = () => {
  const { getUserName } = useAuthentication();
  const userName = getUserName();

  const textInputRef: RefObject<HTMLInputElement> = useRef(null);
  // const messageWrapperRef: RefObject<HTMLDivElement> = useRef(null);

  const [messages, setMessages] = useState<messageObject[]>([]);
  // const [isRedirect, setIsRedirect] = useState(false);
  // const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  // useEffect(() => {
  // if (username === '' || room === '') setIsRedirect(true);

  //TODO: zrobić tak aby można było wysłac wiadomość

  useEffect(() => {
    socket = io(URL);

    socket.on('message', ({ user, text }: { user: string; text: string }) => {
      setMessages(message => [
        ...message,
        { isReceived: user !== userName, senderName: user, content: text },
      ]);
    });
  }, []);

  const joinToRoom = (roomId: string) => {
    socket.emit('join', { name: userName, roomId: roomId }, (error: any) => {
      if (error) {
        alert(error);
      }
    });
  };

  // socket.emit('join', { name: username, room }, (error: any) => {
  //   if (error) {
  //     alert(error);
  //     setIsRedirect(true);
  //   }
  // });

  //   socket.on('onlineUsers', ({ onlineUsers }: { onlineUsers: string[] }) => {
  //     setOnlineUsers(onlineUsers);
  //   });
  // }, []);

  // const sendMessage = () => {
  //   if (textInputRef.current && textInputRef.current.value !== '') {
  //     const textInputRefValue = textInputRef.current.value;

  //     socket.emit('sendMessage', { text: textInputRefValue }, () => {});
  //     setMessages((message) => [
  //       ...message,
  //       { isReceived: false, sender: username, text: textInputRefValue },
  //     ]);

  //     textInputRef.current.value = '';
  //   }
  // };

  // const diconnect = () => {
  //   socket.close();
  // };

  const triggerSend = (e: any) => {
    if (e.keyCode === 13) {
      // sendMessage();
    }
  };

  // useEffect(() => {
  //   if (messageWrapperRef.current) {
  //     messageWrapperRef.current.scrollTop = messageWrapperRef.current.scrollHeight;
  //   }
  // }, [messages]);

  // return {
  //   messages,
  //   textInputRef,
  //   sendMessage,
  //   triggerSend,
  //   isRedirect,
  //   messageWrapperRef,
  //   diconnect,
  //   onlineUsers,
  // };
  // }, []);

  return {
    joinToRoom,
    socketMessages: messages,
    textInputRef,
    triggerSend,
  };
};

export default useChatConnection;
