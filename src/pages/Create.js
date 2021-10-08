import React from 'react';
import { Button, Container, Typography } from '@mui/material';

export default function Create() {
  return (
    <Container>
      <Typography variant='h6' component='h2' gutterBottom>
        create a new note
      </Typography>
      <Button
        onClick={() => {
          console.log('you clicked me');
        }}
        type='submit'
        color='secondary'
        variant='contained'
      >
        Submit
      </Button>
    </Container>
  );
}
