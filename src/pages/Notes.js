import React, { useEffect, useState } from 'react';
import { Container, Typography } from '@mui/material';
import NoteCard from '../Components/NoteCard';
import Masonry from 'react-masonry-css';
import db from '../firebase';
import { collection, onSnapshot, doc, deleteDoc } from '@firebase/firestore';
import { getAuth, onAuthStateChanged } from '@firebase/auth';

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const auth = getAuth();
  const getUserNotes = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        onSnapshot(collection(db, 'notes'), (snapshot) => {
          setNotes(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
          const userEmail = user.email;
          return console.log('user ' + userEmail + ' logged in');
        });

        // ...
      } else {
        console.log('user logged out');
        return setNotes([]);
        // User is signed out
        // ...
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
        {notes.length ? (
          notes.map((note) => (
            <div key={note.id}>
              <NoteCard note={note} handleDelete={handleDelete} />
            </div>
          ))
        ) : (
          <Typography variant='h4' fontWeight='bold'>
            Please log in to see notes
          </Typography>
        )}
      </Masonry>
    </Container>
  );
}
