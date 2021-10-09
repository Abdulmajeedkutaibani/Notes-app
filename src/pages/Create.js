import React, { useState } from 'react';
import { Button, Container, TextField, Typography } from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

export default function Create() {
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [titleError, setTitleError] = useState(false);
  const [detailsError, setDetailsError] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    setDetailsError(false);
    setTitleError(false);

    if (title && details) {
      console.log(title, details);
    }
    if (!title) {
      setTitleError(true);
    }
    if (!details) {
      setDetailsError(true);
    }
  };
  return (
    <Container>
      <Typography
        color='textSecondary'
        variant='h6'
        component='h2'
        gutterBottom
        sx={{
          textDecoration: 'underline',
          textTransform: 'capitalize',
        }}
      >
        create a new note
      </Typography>
      <form noValidate autoComplete='off' onSubmit={handleSubmit}>
        <TextField
          onChange={(e) => setTitle(e.target.value)}
          label='Note Title'
          variant='outlined'
          color='secondary'
          fullWidth
          required
          error={titleError}
          sx={{
            marginTop: '20px',
            marginBottom: '20px',
            display: 'block',
          }}
        />
        <TextField
          onChange={(e) => setDetails(e.target.value)}
          label='Details'
          variant='outlined'
          color='secondary'
          multiline
          rows={4}
          fullWidth
          required
          error={detailsError}
          sx={{
            marginTop: '20px',
            marginBottom: '20px',
            display: 'block',
          }}
        />
        <Button
          type='submit'
          color='secondary'
          variant='contained'
          endIcon={<KeyboardArrowRightIcon />}
        >
          Submit
        </Button>
      </form>
    </Container>
  );
}
