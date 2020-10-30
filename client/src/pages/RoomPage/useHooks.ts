import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import io from 'socket.io-client';

import useAuthentication from 'authentication/authenticationHooks';

let URL: string;
let socket : any;

if (window.location.hostname === 'localhost') {
  URL = 'http://localhost:5000/';
} else {
  URL = 'https://real-time-chat-backend.herokuapp.com/';
}

const useRoomHook = (roomId : string) => {

  const { userTokenId, userName, userId } = useAuthentication();

  const iconMoreRef: any = useRef(null); 
  const textInput: any = useRef(null);
  const messageWrapperRef: any = useRef(null);

  const [messages, setMessages] = useState<any>([]);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isInputHasText, setIsInputHasText] = useState(false);
  const [isInvadeViewOpen, setIsInvadeViewOpen] = useState(false);

  const getMessages = () => {
    userTokenId((token: string) => {
        fetch(`${URL}messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: token, roomId }),
        })
          .then(data => data.json())
          .then(messages => {
            console.log(messages)
            setMessages(messages.messages)
          })
          .catch(error => { 
            //TODO: error
          });
      });
  }

  const colorIcons = () => {
    const circle1 = iconMoreRef.current.getElementById('circle1');
    const circle2 = iconMoreRef.current.getElementById('circle2');
    const circle3 = iconMoreRef.current.getElementById('circle3');

    gsap.to([circle1, circle2, circle3], 0, {
      stroke: 'white',
    })
  }

  const checkInputHasText = (event : any) => {
    if (event.keyCode === 13) {
      sendMessage();
    }

    setTimeout(() => {
      if (textInput.current.value === '') {
        setIsInputHasText(false);
      } else {
        setIsInputHasText(true);
      }
    }, 0)
  } 

  const joinSocketRoom = () => {
    if (userId) {
      socket = io(URL);
      socket.emit(
        'join',
        { name: userName ? userName : 'anonymus', roomId: roomId, userId: userId },
        (error: any) => {
          if (error) {
            //TODO: error
            alert(error);
          }
        },
      );

      socket.on('message', ({text, user} : { text: any, user: any}) => {
        setMessages((prev: any) => [
          ...prev,
          {
            senderName: user,
            isSendByMe: false,
            content: text,
            date: new Date(),
          }
        ])
      })
    }
  }

  const sendMessage = () => {
    const text = textInput.current.value;

    if (text !== '') {
      setMessages &&
      setMessages((prev: any) => [
        ...prev,
        {
          senderName: userName,
          isSendByMe: true,
          content: text,
          date: new Date(),
        },
      ]);
  
      socket.emit('sendMessage', { text }, () => {
        console.log('success send');
      });
  
      textInput.current.value = '';
    }
  }

  const backToMessageView = () => {
    socket.emit('disconnectRoom', { lastRoomId: roomId });
  }

  useEffect(() => {
    colorIcons();
    getMessages();
  }, [])

  useEffect(() => {
    joinSocketRoom();
  }, [userId])

  useEffect(() => {
    messageWrapperRef.current.scrollTop = messageWrapperRef.current.scrollHeight;
  }, [messages])

  return {
    iconMoreRef,
    isInputFocused,
    setIsInputFocused,
    isInputHasText,
    checkInputHasText,
    messages,
    textInput,
    sendMessage,
    backToMessageView,
    isInvadeViewOpen,
    setIsInvadeViewOpen,
    messageWrapperRef
  }
};

export default useRoomHook;