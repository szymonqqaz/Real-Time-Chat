import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { SendRounded } from '@material-ui/icons';
import { grey } from '@material-ui/core/colors';

import OnlineUsersfrom from 'components/OnlineUsers';
import LeaveButton from 'components/LeaveButton';

import firebase from 'firebase';

import useAuthentication from 'authentication/authenticationHooks';

import useChatConnection from './hooks';
import {
  MainWrapper,
  MessageSenderInput,
  MessagesMainWrapper,
  MessagesWrapper,
  SendButton,
  SenderWrapper,
  Message,
} from './styles';

import { RoomButton, NewButton, LeftBar, FlexDiv } from './newStyles';

import io from 'socket.io-client';

let URL: string;
let socket: any;

if (window.location.hostname === 'localhost') {
  URL = 'http://localhost:5500/';
} else {
  URL = 'https://real-time-chat-backend.herokuapp.com/';
}

interface hello {
  roomName: string;
  _id: string;
}

interface messageInterface {
  date: Date;
  senderName: string;
  content: string;
  roomId: string;
  _id: string;
}

// current!
// TODO: REVIEW!
// I don't work start with git, I've to focus on it!

// TODO: I can't switch between rooms
// TODO: Test on front-end, 1) is possible to make unite test or intergration 2) E2E tests

const ChatPage = () => {
  const [nameRooms, setNameRooms] = useState<hello[]>([]);
  const [messages, setMessages] = useState<messageInterface[]>([]);
  const [currentRoom, setCurrentRoom] = useState('');

  const { joinToRoom, socketMessages, textInputRef, triggerSend } = useChatConnection();

  React.useEffect(() => {
    setMessages((prev: any[]) => [...prev, ...socketMessages]);
  }, [socketMessages]);

  const { logout, userTokenId } = useAuthentication();

  React.useEffect(() => {
    userTokenId((token: string) => {
      fetch('http://localhost:5500/getRooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: token }),
      })
        .then(data => data.json())
        .then(e => {
          setNameRooms(e.nameRooms);
          console.log(e);
        })
        .catch(err => console.log(err));
    });
  }, []);

  const getRoomsMessage = (roomId: string, roomName: string) => {
    setCurrentRoom(roomName);
    userTokenId((token: string) => {
      fetch('http://localhost:5500/getMessages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: token, roomId: roomId }),
      })
        .then(data => data.json())
        .then(e => {
          setMessages((prev: any[]) => [...prev, ...e.messages]);
          joinToRoom(roomId);
        })
        .catch(err => console.log(err));
    });
  };

  const CreateNewRoom = () => {
    const roomName = prompt('Please enter your name', '');

    if (roomName?.length === 0) {
      alert('FAIL! Room name have to be more that one letter');
    } else {
      userTokenId((token: string) => {
        console.log('send');
        fetch('http://localhost:5500/createRoom', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: token, roomName: roomName }),
        })
          .then(data => data.json())
          .then(e => {
            setNameRooms(e.nameRooms);
          })
          .catch(err => console.log(err));
      });
    }
  };

  return (
    <>
      <FlexDiv>
        <LeftBar>
          <NewButton onClick={CreateNewRoom}>create a new room</NewButton>
          {nameRooms &&
            nameRooms.length !== 0 &&
            nameRooms.map(e => (
              <RoomButton onClick={() => getRoomsMessage(e._id, e.roomName)}>
                {e.roomName}
              </RoomButton>
            ))}
        </LeftBar>
        <MainWrapper>
          <MessagesMainWrapper>
            <h1>{currentRoom}</h1>
            {/* <MessagesWrapper ref={messageWrapperRef}> */}
            <MessagesWrapper>
              {messages &&
                messages.length !== 0 &&
                messages.map(({ senderName, content, _id }, index) => {
                  return (
                    <Message isRight={true} username={senderName} key={_id}>
                      {content}
                    </Message>
                  );
                })}
            </MessagesWrapper>
            <SenderWrapper>
              <MessageSenderInput
                placeholder="napisz coś..."
                ref={textInputRef}
                // onKeyUp={e => triggerSend(e)}
              />
              {/* <SendButton onClick={sendMessage}> */}
              <SendButton onClick={() => {}}>
                <SendRounded style={{ fontSize: 24, color: grey[50], marginLeft: 1 }} />
              </SendButton>
            </SenderWrapper>
          </MessagesMainWrapper>
          {/* <OnlineUsersfrom onlineUsers={onlineUsers} /> */}
          {/* <LeaveButton diconnect={diconnect} /> */}
        </MainWrapper>
        <h1>hello I am chat page</h1>
        <button onClick={logout} style={{ height: '30px' }}>
          logout
        </button>
      </FlexDiv>
    </>
  );
};

export default ChatPage;

// if (isRedirect) {
//   return <Redirect to="/" />;
// }

// return (
//   <MainWrapper>
//     <MessagesMainWrapper>
//       <MessagesWrapper ref={messageWrapperRef}>
//         {messages.map(({ isReceived, sender, text }, index) => {
//           return (
//             <Message isRight={isReceived} username={sender} key={text}>
//               {text}
//             </Message>
//           );
//         })}
//       </MessagesWrapper>
//       <SenderWrapper>
//         <MessageSenderInput
//           placeholder="napisz coś..."
//           ref={textInputRef}
//           onKeyUp={e => triggerSend(e)}
//         />
//         <SendButton onClick={sendMessage}>
//           <SendRounded style={{ fontSize: 24, color: grey[50], marginLeft: 1 }} />
//         </SendButton>
//       </SenderWrapper>
//     </MessagesMainWrapper>
//     <OnlineUsersfrom onlineUsers={onlineUsers} />
//     <LeaveButton diconnect={diconnect} />
//   </MainWrapper>
// );
