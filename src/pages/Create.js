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
import db from '../firebase';
import { collection, addDoc } from '@firebase/firestore';
import { getAuth, onAuthStateChanged } from '@firebase/auth';

export default function Create() {
  const history = useHistory();
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [titleError, setTitleError] = useState(false);
  const [detailsError, setDetailsError] = useState(false);
  const [category, setCategory] = useState('reminders');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDetailsError(false);
    setTitleError(false);
    const auth = getAuth();

    if (title && details) {
      const userId = auth.currentUser.uid;
      const collectionRef = collection(db, 'notes');
      const payload = {
        title,
        category,
        details,
        userId,
      };
      await addDoc(collectionRef, payload);
      history.push('/');
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
      <Button
        onClick={() => {
          history.push('/');
        }}
        variant='contained'
        fullWidth
        sx={{
          display: { xs: 'block', sm: 'none' },
          background: 'gold',
          color: 'black',
          marginBottom: 2,
        }}
      >
        Back To Notes
      </Button>
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
