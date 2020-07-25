import {Schema} from 'mongoose';

export const UsersSchema = new Schema({
  userId: {type: String, required: true},
  name: {type: String, required: true},
  rooms: [
    {
      id: Schema.Types.ObjectId,
      roomName: String,
      roomId: String,
    },
  ],
});

export const RoomsDataSchema = new Schema({
  userId: {type: String, required: true},
  rooms: [
    {
      roomName: {type: String, required: true},
      roomId: Schema.Types.ObjectId,
    },
  ],
});

export const MessagesAllSchema = new Schema({
  senderName: {type: String, required: true},
  content: String,
  date: {type: Date, default: Date.now()},
  roomId: Schema.Types.ObjectId,
});