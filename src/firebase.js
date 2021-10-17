// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDpu5PphZxKAEPL8lWGtkp5g2IbouWQnMk',
  authDomain: 'ak-notes-73043.firebaseapp.com',
  projectId: 'ak-notes-73043',
  storageBucket: 'ak-notes-73043.appspot.com',
  messagingSenderId: '174867080553',
  appId: '1:174867080553:web:45ffc2d0c765496d9009f8',
  measurementId: 'G-ZLP43TH6F8',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export default getFirestore();
