import React from 'react';
import {
  CardHeader,
  CardContent,
  Typography,
  IconButton,
  Card,
  Avatar,
} from '@mui/material';
import { DeleteOutlined } from '@mui/icons-material';

const NoteCard = ({ note, handleDelete, currentUserId }) => {
  console.log(note.id, currentUserId);
  return (
    <div>
      <Card
        elevation={1}
        sx={
          note.category == 'work'
            ? { border: '1px solid red' }
            : note.category == 'reminders'
            ? { border: '1px solid blue' }
            : note.category == 'todos'
            ? { border: '1px solid pink' }
            : note.category == 'money'
            ? { border: '1px solid green' }
            : null
        }
      >
        <CardHeader
          avatar={
            <Avatar
              sx={
                note.category == 'work'
                  ? { background: 'red', fontWeight: 'bold' }
                  : note.category == 'reminders'
                  ? { background: ' blue', fontWeight: 'bold' }
                  : note.category == 'todos'
                  ? { background: 'purple', fontWeight: 'bold' }
                  : note.category == 'money'
                  ? { background: ' green', fontWeight: 'bold' }
                  : null
              }
            >
              {note.category[0].toUpperCase()}
            </Avatar>
          }
          action={
            note.id === currentUserId ? (
              <IconButton onClick={() => handleDelete(note.id)}>
                <DeleteOutlined />
              </IconButton>
            ) : null
          }
          title={note.title}
          subheader={note.category}
        />
        <CardContent>
          <Typography variant='body2' color='textSecondary'>
            {note.details}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default NoteCard;
