import React, { useEffect, useState } from 'react';
import { Container } from '@mui/material';
import NoteCard from '../Components/NoteCard';
import Masonry from 'react-masonry-css';
import db from '../firebase';
import { collection, onSnapshot, doc, deleteDoc } from '@firebase/firestore';

export default function Notes() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    onSnapshot(collection(db, 'notes'), (snapshot) => {
      setNotes(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
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
        {notes.map((note) => (
          <div key={note.id}>
            <NoteCard note={note} handleDelete={handleDelete} />
          </div>
        ))}
      </Masonry>
    </Container>
  );
}
