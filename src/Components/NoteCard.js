import React from 'react';
import {
  CardHeader,
  CardContent,
  Typography,
  IconButton,
  Card,
} from '@mui/material';
import { DeleteOutlined } from '@mui/icons-material';

const NoteCard = ({ note, handleDelete }) => {
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
            ? { border: '1px solid yellow' }
            : note.category == 'money'
            ? { border: '1px solid green' }
            : null
        }
      >
        <CardHeader
          action={
            <IconButton onClick={() => handleDelete(note.id)}>
              <DeleteOutlined />
            </IconButton>
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
