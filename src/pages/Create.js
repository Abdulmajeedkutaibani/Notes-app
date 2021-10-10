import React, { useState } from 'react';
import {
  Button,
  Container,
  TextField,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useHistory } from 'react-router';

export default function Create() {
  const history = useHistory();
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [titleError, setTitleError] = useState(false);
  const [detailsError, setDetailsError] = useState(false);
  const [category, setCategory] = useState('todos');
  const handleSubmit = (e) => {
    e.preventDefault();
    setDetailsError(false);
    setTitleError(false);

    if (title && details) {
      fetch('http://localhost:8000/notes', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ title, details, category }),
      }).then(() => history.push('/'));
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
        <FormControl
          sx={{
            marginTop: '20px',
            marginBottom: '20px',
            display: 'block',
          }}
        >
          <FormLabel>Note Category</FormLabel>
          <RadioGroup
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
            }}
          >
            <FormControlLabel
              value='money'
              control={<Radio color='secondary' />}
              label='money'
            />
            <FormControlLabel
              value='todos'
              control={<Radio color='secondary' />}
              label='Todos'
            />
            <FormControlLabel
              value='reminders'
              control={<Radio color='secondary' />}
              label='Reminders'
            />
            <FormControlLabel
              value='work'
              control={<Radio color='secondary' />}
              label='Work'
            />
          </RadioGroup>
        </FormControl>
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
