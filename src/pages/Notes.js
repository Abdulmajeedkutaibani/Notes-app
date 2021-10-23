import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  IconButton,
  Typography,
} from '@mui/material';
import NoteCard from '../Components/NoteCard';
import Masonry from 'react-masonry-css';
import db from '../firebase';
import { collection, onSnapshot, doc, deleteDoc } from '@firebase/firestore';
import { getAuth, onAuthStateChanged } from '@firebase/auth';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Link } from 'react-router-dom';

export default function Notes() {
  const auth = getAuth();
  const [userUID, setUserUID] = useState(null);
  const [addNoteDisplay, setaddNoteDisplay] = useState('none');
  const [notes, setNotes] = useState([]);
  const [loginMessageDisplay, setLoginMessageDisplay] = useState('none');
  const getUserNotes = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserUID(auth.currentUser.uid);
        setLoginMessageDisplay('none');

        onSnapshot(collection(db, 'notes'), (snapshot) => {
          setNotes(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        });
        console.log(user.email + ' logged in');
        setaddNoteDisplay('flex');
        // ...
      } else {
        setaddNoteDisplay('none');
        setLoginMessageDisplay('block');
        setNotes([]);
        console.log('User logged out');
        setUserUID(null);
      }
    });
  };
  useEffect(() => {
    getUserNotes();
  }, []);

  const handleDelete = async (id) => {
    const docRef = doc(db, 'notes', id);
    await deleteDoc(docRef);
    const newNotes = notes.filter((note) => note.id != id);
    setNotes(newNotes);
  };

  const breakpoints = {
    default: 3,
    1100: 2,
    700: 1,
  };
  return (
    <Container>
      <Masonry
        breakpointCols={breakpoints}
        className='my-masonry-grid'
        columnClassName='my-masonry-grid_column'
      >
        {userUID
          ? notes
              .filter((note) => note.userId === userUID)
              .map((note) => (
                <div key={userUID}>
                  <NoteCard
                    note={note}
                    handleDelete={handleDelete}
                    currentUserId={userUID}
                  />
                </div>
              ))
          : null}
        <Typography
          variant='h4'
          fontWeight='bold'
          sx={{ display: loginMessageDisplay }}
        >
          Please Log In To View And Create Notes
        </Typography>

        <Button
          color='inherit'
          sx={{
            display: addNoteDisplay,
            flexDirection: 'column',
          }}
        >
          <Link
            to='/create'
            style={{ textDecoration: 'none', color: '#2196f3' }}
          >
            <AddCircleOutlineIcon sx={{ fontSize: 90 }} />
            <Typography
              variant='h5'
              fontWeight='bold'
              sx={{ textAlign: 'center' }}
            >
              Create A New Note
            </Typography>
          </Link>
        </Button>
      </Masonry>
    </Container>
  );
}
