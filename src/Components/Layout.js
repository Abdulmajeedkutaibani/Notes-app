import React, { useEffect, useState } from 'react';
import {
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  useTheme,
  Avatar,
  Button,
  Modal,
  TextField,
  Input,
  InputAdornment,
  Grid,
} from '@mui/material';
import {
  AccountCircle,
  AddCircleOutlined,
  AlternateEmail,
  SubjectOutlined,
  VpnKey,
} from '@mui/icons-material';
import { useHistory, useLocation } from 'react-router';
import { format } from 'date-fns';
import { Box } from '@mui/system';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth';
import db from '../firebase';
import {
  collection,
  onSnapshot,
  doc,
  deleteDoc,
  addDoc,
  setDoc,
  getDoc,
} from '@firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { green, LightGreen } from '@mui/material/colors';
const drawerWidth = 240;

const menuItems = [
  {
    Text: 'Notes',
    Icon: <SubjectOutlined color='secondary' />,
    path: '/',
  },
  {
    Text: 'Create Note',
    Icon: <AddCircleOutlined color='secondary' />,
    path: '/create',
  },
];
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: 400,
  minWidth: 200,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  borderRadius: '8px',
  boxShadow: 24,
  p: 4,
};

const Layout = ({ children }) => {
  const auth = getAuth();
  const storage = getStorage();
  const [openLogin, setOpenLogin] = useState(false);
  const handleLoginOpen = () => setOpenLogin(true);
  const handleLoginClose = () => setOpenLogin(false);
  const [openSignUP, setOpenSignUP] = useState(false);
  const [openAccount, setOpenAccount] = useState(false);
  const handleSignUpOpen = () => setOpenSignUP(true);
  const handleSignUpClose = () => setOpenSignUP(false);
  const handleAccountOpen = () => setOpenAccount(true);
  const handleAccountClose = () => setOpenAccount(false);
  const [signUpName, setSignUpName] = useState('Not Set');
  const [signUpEmail, setSignUpEmail] = useState();
  const [signUpPassword, setSignUpPassword] = useState();
  const [signUpBio, setSignUpBio] = useState();
  const [loginEmail, setLoginEmail] = useState();
  const [loginPassword, setLoginPassword] = useState();
  const [guestLinks, setGuestLinks] = useState('none');
  const [userLinks, setUserLinks] = useState('none');
  const [accountInfo, setAccountInfo] = useState();
  const [profilePhoto, setProfilePhoto] = useState();
  const [imageUrl, setImageUrl] = useState();
  const [errorMessage, setErrorMessage] = useState(false);

  // Get a reference to the storage service, which is used to create references in your storage bucket
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUserLinks('block');
      setGuestLinks('none');
      setAccountInfo(user.email);
      onSnapshot(doc(db, 'users', auth.currentUser.uid), (doc) => {
        setSignUpName(doc.data().name);
        setSignUpBio(doc.data().bio);
      });

      getDownloadURL(ref(storage, `PhotoCollection/${auth.currentUser.uid}`))
        .then((url) => {
          setImageUrl(url);
        })
        .catch((err) => {
          console.log(err.message);
        });
    } else {
      setUserLinks('none');
      setGuestLinks('block');
      setAccountInfo('');
      setImageUrl(null);
    }
  });

  // Create a storage reference
  const uploadImage = () => {
    const auth = getAuth();
    const imagesRef = ref(storage, `PhotoCollection/${auth.currentUser.uid}`);
    uploadBytes(imagesRef, profilePhoto).then((snapshot) => {
      console.log('Uploaded a blob or file!');
    });
  };

  useEffect(() => {
    if (profilePhoto) {
      uploadImage();
      setOpenAccount(false);
      getDownloadURL(
        ref(storage, `PhotoCollection/${auth.currentUser.uid}`)
      ).then((url) => {
        setImageUrl(url);
      });
    }
  }, [profilePhoto]);

  const theme = useTheme();
  const classes = {
    page: {
      background: '#f9f9f9',
      width: '100%',
      padding: theme.spacing(3),
    },
  };
  const history = useHistory();
  const location = useLocation();

  const signUpUser = async () => {
    const email = signUpEmail;
    const password = signUpPassword;
    const bio = signUpBio;
    const name = signUpName;
    const auth = getAuth();

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const userId = userCredential.user.uid;
        console.log(userId);
        setProfilePhoto(userId);
        setDoc(doc(db, 'users', userId), {
          name,
          bio,
        });
        onSnapshot(doc(db, 'users', auth.currentUser.uid), (doc) => {
          setSignUpName(doc.data().name);
          setSignUpBio(doc.data().bio);
        });
        setOpenSignUP(false);

        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setErrorMessage(true);

        // ..
      });
  };

  const signInUser = () => {
    const email = loginEmail;
    const password = loginPassword;
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user.email;
        setOpenLogin(false);
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error;
        console.log('please enter correct sign in info');
        setErrorMessage(true);
      });
  };
  const SignOutUser = () => {
    auth.signOut().then(() => {});
  };

  return (
    <div style={{ display: 'flex' }}>
      {/* app bar */}
      <AppBar
        color='inherit'
        elevation={0}
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
        }}
      >
        <Toolbar>
          <Typography sx={{ flexGrow: 1 }}>
            Today is the {format(new Date(), 'do MMMM Y')}
          </Typography>

          <Button
            color='inherit'
            onClick={handleLoginOpen}
            sx={{ display: guestLinks }}
          >
            Login
          </Button>
          <Button
            color='inherit'
            sx={{ display: userLinks }}
            onClick={handleAccountOpen}
          >
            Account
          </Button>
          <Button
            color='inherit'
            onClick={handleSignUpOpen}
            sx={{ display: guestLinks }}
          >
            Sign Up
          </Button>
          <Button
            color='inherit'
            onClick={SignOutUser}
            sx={{ display: userLinks }}
          >
            Logout
          </Button>
          <Avatar src={imageUrl} sx={{ marginLeft: theme.spacing(2) }} />

          {/* Login modal */}
          <Modal
            open={openLogin}
            onClose={handleLoginClose}
            aria-labelledby='modal-modal-title'
            aria-describedby='modal-modal-description'
          >
            <Box sx={style} component='form' noValidate>
              <TextField
                onChange={(e) => setLoginEmail(e.target.value)}
                label='Email'
                variant='outlined'
                color='secondary'
                fullWidth
                required
                type='email'
                id='login-email'
                sx={{
                  marginTop: '20px',
                  marginBottom: '20px',
                  display: 'block',
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <AccountCircle />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                onChange={(e) => setLoginPassword(e.target.value)}
                label='Password'
                variant='outlined'
                color='secondary'
                fullWidth
                required
                type='password'
                id='login-password'
                error={errorMessage}
                helperText={errorMessage ? 'Unable To Sign In' : null}
                sx={{
                  marginTop: '20px',
                  marginBottom: '20px',
                  display: 'block',
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <VpnKey />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                onClick={signInUser}
                color='primary'
                variant='contained'
                sx={{ width: '100%' }}
              >
                Login
              </Button>
            </Box>
          </Modal>
          {/* Sign up modal */}
          <Modal
            open={openSignUP}
            onClose={handleSignUpClose}
            aria-labelledby='modal-modal-title'
            aria-describedby='modal-modal-description'
          >
            <Box sx={style}>
              <Typography variant='h5' fontWeight='bold'>
                Sign Up
              </Typography>
              <TextField
                onChange={(e) => setSignUpName(e.target.value)}
                label='Name'
                variant='outlined'
                color='secondary'
                fullWidth
                required
                error={errorMessage}
                helperText={errorMessage ? 'This Field Is Required' : null}
                id='signUp-name'
                sx={{
                  marginTop: '20px',
                  marginBottom: '20px',
                  display: 'block',
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <AccountCircle />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                onChange={(e) => setSignUpEmail(e.target.value)}
                label='Email'
                variant='outlined'
                color='secondary'
                fullWidth
                required
                type='email'
                helperText='Please enter a valid Email'
                id='signUp-email'
                sx={{
                  marginTop: '20px',
                  marginBottom: '20px',
                  display: 'block',
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <AlternateEmail />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                onChange={(e) => setSignUpPassword(e.target.value)}
                label='Password'
                variant='outlined'
                color='secondary'
                fullWidth
                required
                type='password'
                id='signUp-password'
                sx={{
                  marginTop: '20px',
                  marginBottom: '20px',
                  display: 'block',
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <VpnKey />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                onChange={(e) => setSignUpBio(e.target.value)}
                label='bio'
                variant='outlined'
                color='secondary'
                fullWidth
                required
                multiline
                rows={4}
                id='signUp-bio'
                sx={{
                  marginTop: '20px',
                  marginBottom: '20px',
                  display: 'block',
                }}
              />

              <Button
                onClick={signUpUser}
                variant='contained'
                fullWidth
                color='success'
              >
                Sign Up
              </Button>
            </Box>
          </Modal>
          {/* Account Modal */}
          <Modal
            open={openAccount}
            onClose={handleAccountClose}
            aria-labelledby='modal-modal-title'
            aria-describedby='modal-modal-description'
          >
            <Box sx={style}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography
                    id='modal-modal-title'
                    variant='h6'
                    component='h2'
                  >
                    Logged in as:
                    <Typography variant='h6' component='h2' color='green'>
                      {signUpName}
                    </Typography>
                  </Typography>
                </Grid>
                <Grid item xs={12} sx={{ mx: 'auto' }}>
                  <Typography
                    id='modal-modal-title'
                    variant='h6'
                    component='h2'
                  >
                    User Email:
                    <Typography variant='h6' component='h2' color='teal'>
                      {accountInfo}
                    </Typography>
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    id='modal-modal-title'
                    variant='h6'
                    component='h2'
                  >
                    Bio:
                    <Typography variant='h6' component='h2' color='red'>
                      {signUpBio}
                    </Typography>
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Avatar
                    src={imageUrl}
                    sx={{
                      mx: 'auto',
                      width: 130,
                      height: 130,
                      border: '1px solid lightblue',
                    }}
                  />
                </Grid>
                <Grid item sx={{ mx: 'auto' }}>
                  <label htmlFor='contained-button-file'>
                    <Input
                      id='contained-button-file'
                      accept='image/*'
                      multiple
                      type='file'
                      sx={{ display: 'none' }}
                      onChange={(e) => setProfilePhoto(e.target.files[0])}
                    />
                    <Button variant='contained' component='span'>
                      Upload A Profile Photo
                    </Button>
                  </label>
                </Grid>
              </Grid>
            </Box>
          </Modal>
        </Toolbar>
      </AppBar>
      {/* side drawer */}
      <Drawer
        sx={{
          width: drawerWidth,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
          },
        }}
        variant='permanent'
        anchor='left'
      >
        <div>
          <Typography variant='h5' sx={{ padding: 2 }}>
            AK Notes
          </Typography>
        </div>

        {/* list / links */}
        <List sx={{ display: userLinks }}>
          {menuItems.map((item) => (
            <ListItem
              key={item.Text}
              button
              onClick={() => {
                history.push(item.path);
              }}
              sx={
                location.pathname == item.path
                  ? { background: '#f4f4f4' }
                  : null
              }
            >
              <ListItemIcon>{item.Icon}</ListItemIcon>
              <ListItemText primary={item.Text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <div style={classes.page}>
        <div style={theme.mixins.toolbar}></div>
        {children}
      </div>
    </div>
  );
};

export default Layout;
