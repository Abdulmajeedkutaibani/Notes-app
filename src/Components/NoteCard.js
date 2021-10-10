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
      <Card elevation={3}>
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
