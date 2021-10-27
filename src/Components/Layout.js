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
  Box,
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
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  deleteUser,
} from 'firebase/auth';
import db from '../firebase';
import { onSnapshot, doc, setDoc } from '@firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Header } from './Header';

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
  width: '50%',
  minWidth: 100,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  borderRadius: '8px',
  boxShadow: 24,
  p: 4,
};
const style2 = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: 600,
  width: '50%',
  minWidth: 100,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  borderRadius: '8px',
  boxShadow: 24,
  p: 2,
};

const schema = yup.object().shape({
  loginEmail: yup.string().email().required(),
  loginPassword: yup.string().min(7).max(15).required(),
});
const schema2 = yup.object().shape({
  signupName: yup.string().required(),
  signupEmail: yup.string().email().required(),
  signupPassword: yup.string().min(7).max(15).required(),
  bio: yup.string().required(),
});

const Layout = ({ children }) => {
  const auth = getAuth();
  const storage = getStorage();
  const [openLogin, setOpenLogin] = useState(false);
  const handleLoginOpen = () => setOpenLogin(true);
  const handleLoginClose = () => setOpenLogin(false);
  const [openSignUP, setOpenSignUP] = useState(false);
  const [openAccount, setOpenAccount] = useState(false);
  const [openDeleteAccount, setOpenDeleteAccount] = useState(false);
  const handleSignUpOpen = () => setOpenSignUP(true);
  const handleSignUpClose = () => setOpenSignUP(false);
  const handleAccountOpen = () => setOpenAccount(true);
  const handleAccountClose = () => setOpenAccount(false);
  const handleDeleteAccountClose = () => setOpenDeleteAccount(false);
  const [signUpName, setSignUpName] = useState('Not Set');
  const [signUpBio, setSignUpBio] = useState();
  const [guestLinks, setGuestLinks] = useState('none');
  const [userLinks, setUserLinks] = useState('none');
  const [accountInfo, setAccountInfo] = useState();
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [imageUrl, setImageUrl] = useState();
  const [loginErrorMessage, setLoginErrorMessage] = useState();
  const [signupErrorMessage, setSignupErrorMessage] = useState();
  const [loginMessageDisplay, setLoginMessageDisplay] = useState('none');
  const [notesRendering, setNotesRendering] = useState();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const {
    register: register2,
    handleSubmit: handleSubmit2,
    formState: { errors: errors2 },
    reset: reset2,
  } = useForm({
    resolver: yupResolver(schema2),
  });

  // Get a reference to the storage service, which is used to create references in your storage bucket
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setNotesRendering(children);
      setLoginMessageDisplay('none');
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
      setLoginMessageDisplay('block');
      setUserLinks('none');
      setGuestLinks('block');
      setAccountInfo('');
      setImageUrl(null);
    }
  });

  // Create a storage reference
  const uploadImage = () => {
    const auth = getAuth();
    if (auth.currentUser) {
      const imagesRef = ref(storage, `PhotoCollection/${auth.currentUser.uid}`);
      uploadBytes(imagesRef, profilePhoto).then((snapshot) => {
        console.log('Uploaded a blob or file!');
      });
    }
  };

  useEffect(() => {
    if (profilePhoto) {
      uploadImage();
      setOpenAccount(false);
      getDownloadURL(ref(storage, `PhotoCollection/${auth.currentUser.uid}`))
        .then((url) => {
          setImageUrl(url);
        })
        .catch((error) => {
          console.log(error.message);
        });
    } else console.log('no picture uploaded');
  }, [profilePhoto]);

  const theme = useTheme();

  const history = useHistory();
  const location = useLocation();

  const signUpUser = (data) => {
    const name = data.signupName;
    const email = data.signupEmail;
    const password = data.signupPassword;
    const bio = data.bio;
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
        setSignupErrorMessage();
        reset2();

        // ...
      })
      .catch((error) => {
        setSignupErrorMessage(
          `This user Email is already taken. Try Signing up with another Email.`
        );

        // ..
      });
  };

  const signInUser = (signInData) => {
    const email = signInData.loginEmail;
    const password = signInData.loginPassword;
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        setLoginErrorMessage();
        setOpenLogin(false);
        reset();
        // ...
      })
      .catch((error) => {
        setLoginErrorMessage(
          `Login Error. Make sure you entered the Email and Password correctly and that you're Signed Up.`
        );
      });
  };
  const SignOutUser = () => {
    history.push('/');
    auth.signOut().catch((error) => {
      console.log(error.message);
    });

    setNotesRendering(null);
  };

  const handleUserDelete = () => {
    const auth = getAuth();
    const user = auth.currentUser;

    deleteUser(user)
      .then(() => {
        console.log('User Deleted');
        history.push('/');
        setOpenAccount(false);
      })
      .catch((error) => {
        setOpenDeleteAccount(true);
      });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' } }}>
      {/* app bar */}
      <Header />
      <AppBar
        color='inherit'
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)`, xs: '100%' },
          marginTop: { xs: '4.5rem', sm: 0 },
        }}
      >
        <Toolbar
          sx={{
            xs: {
              display: 'flex',
              flexDirection: 'column',
              background: 'teal',
            },
            sm: { display: 'block', background: 'white' },
          }}
        >
          <Typography
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            Today is the {format(new Date(), 'do MMMM Y')}
          </Typography>
          <Typography
            sx={{ display: { xs: 'block', sm: 'none' }, flexGrow: 1 }}
          >
            {format(new Date(), 'do MMMM Y')}
          </Typography>

          <Button
            variant='contained'
            color='primary'
            onClick={handleLoginOpen}
            sx={{ display: guestLinks, marginRight: '10px' }}
          >
            Login
          </Button>
          <Button
            variant='outlined'
            color='success'
            sx={{
              display: { xs: 'none', sm: userLinks },
            }}
            onClick={handleAccountOpen}
            // { xs: 'none', sm: 'block' }
          >
            Account
          </Button>
          <Button
            variant='outlined'
            color='success'
            onClick={handleSignUpOpen}
            sx={{ display: guestLinks }}
          >
            Sign Up
          </Button>
          <Button
            variant='outlined'
            color='error'
            onClick={SignOutUser}
            sx={{
              display: userLinks,
              marginLeft: 1,
            }}
          >
            Logout
          </Button>
          <Avatar
            src={imageUrl}
            sx={{
              marginLeft: theme.spacing(2),
              display: userLinks,
              cursor: 'pointer',
            }}
            onClick={handleAccountOpen}
          />

          {/* Login modal */}
          <Modal
            open={openLogin}
            onClose={handleLoginClose}
            aria-labelledby='modal-modal-title'
            aria-describedby='modal-modal-description'
          >
            <Box
              key={1}
              sx={style}
              component='form'
              noValidate
              onSubmit={handleSubmit(signInUser)}
            >
              <Typography color='error' sx={{ fontWeight: 'bold' }}>
                {loginErrorMessage}
              </Typography>
              <TextField
                {...register('loginEmail')}
                label='Email'
                variant='outlined'
                color='secondary'
                fullWidth
                required
                error={errors.loginEmail ? true : false}
                helperText={
                  errors.loginEmail ? 'please enter a valid Email' : null
                }
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
                {...register('loginPassword')}
                label='Password'
                variant='outlined'
                color='secondary'
                fullWidth
                error={errors.loginPassword ? true : false}
                helperText={
                  errors.loginPassword
                    ? 'Password must contain 8 to 15 characters'
                    : null
                }
                type='password'
                id='login-password'
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
                type='submit'
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
            <Box
              key={2}
              sx={style}
              component='form'
              onSubmit={handleSubmit2(signUpUser)}
            >
              <Typography variant='h5' fontWeight='bold'>
                Sign Up
              </Typography>
              <br />
              <Typography color='error' sx={{ fontWeight: 'bold' }}>
                {signupErrorMessage}
              </Typography>
              <TextField
                {...register2('signupName')}
                label='Name'
                variant='outlined'
                color='secondary'
                fullWidth
                error={errors2.signupName ? true : false}
                helperText={
                  errors2.signupName ? `This field can't be empty` : null
                }
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
                {...register2('signupEmail')}
                label='Email'
                variant='outlined'
                color='secondary'
                fullWidth
                required
                error={errors2.signupEmail ? true : false}
                helperText={
                  errors2.signupEmail ? 'please enter a valid Email' : null
                }
                type='email'
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
                {...register2('signupPassword')}
                label='Password'
                variant='outlined'
                color='secondary'
                fullWidth
                error={errors2.signupPassword ? true : false}
                helperText={
                  errors2.signupPassword
                    ? 'Password must contain 8 to 15 characters'
                    : null
                }
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
                {...register2('bio')}
                label='bio'
                variant='outlined'
                color='secondary'
                fullWidth
                error={errors2.bio ? true : false}
                helperText={errors2.bio ? `This field can't be empty` : null}
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
                type='submit'
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
                  <Typography id='modal-modal-title' variant='h5'>
                    Logged in as:
                    <br />
                    <Typography variant='h6' color='green' component='span'>
                      {signUpName}
                    </Typography>
                  </Typography>
                </Grid>
                <Grid item xs={12} sx={{ mx: 'auto' }}>
                  <Typography id='modal-modal-title' variant='h5'>
                    User Email: <br />
                    <Typography variant='h6' color='teal' component='span'>
                      {accountInfo}
                    </Typography>
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography id='modal-modal-title' variant='h5'>
                    Bio:
                    <br />
                    <Typography variant='h6' color='red' component='span'>
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
                <Grid item sx={{ width: '100%' }}>
                  <Button
                    fullWidth
                    variant='contained'
                    color='error'
                    onClick={handleUserDelete}
                  >
                    Delete Account
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Modal>
          {/* Delete Account Modal */}
          <Modal
            open={openDeleteAccount}
            onClose={handleDeleteAccountClose}
            aria-labelledby='modal-modal-title'
            aria-describedby='modal-modal-description'
          >
            <Box sx={style2}>
              <Typography
                variant='h5'
                color='red'
                component='span'
                sx={{ fontWeight: 'bold' }}
              >
                Invalid command: if you want to delete your account then please
                do this step immediatly after you login
              </Typography>
              <br />
              <br />
              <Typography variant='h6' color='blue' component='span'>
                Instructions: Logout of the current Account{' '}
                <Typography variant='h6' color='teal' component='span'>
                  {accountInfo}
                </Typography>
                , then Login again using the same Account,Then immediatly open
                the Account page and then click
                <Typography variant='h6' color='red' component='span'>
                  {' '}
                  DELETE ACCOUNT{' '}
                </Typography>
                and your account will be deleted permanently.
              </Typography>
            </Box>
          </Modal>
          {/* side drawer */}
        </Toolbar>
      </AppBar>

      <Drawer
        sx={{
          width: drawerWidth,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
          },
          display: { xs: 'none', sm: 'flex' },
        }}
        variant='permanent'
        anchor='left'
      >
        <Box
          sx={{ marginBottom: 'auto', padding: 2, cursor: 'pointer' }}
          onClick={() => {
            history.push('/');
          }}
        >
          <Typography
            variant='h4'
            component='span'
            sx={{ fontWeight: 'bold' }}
            color='primary'
          >
            AK
          </Typography>{' '}
          <Typography variant='h4' component='span'>
            Notes
          </Typography>
        </Box>
        {/* list / links */}
        <List sx={{ display: userLinks, flexGrow: '1' }}>
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
        <Typography
          variant='subtitle2'
          sx={{
            padding: 2,
            background: '#003366',
            color: 'white',
            fontWeight: 'bold',
          }}
        >
          © 2021 Abdulmajeed Kutaibani <br /> abodymeo@gmail.com
        </Typography>
      </Drawer>
      <Box
        sx={{ background: '#f9f9f9', width: '100%', padding: theme.spacing(3) }}
      >
        <Box sx={theme.mixins.toolbar}></Box>
        {notesRendering}
        <Typography
          variant='h4'
          fontWeight='bold'
          sx={{ display: loginMessageDisplay }}
        >
          Please Log In To Create And View Notes
        </Typography>
      </Box>
    </Box>
  );
};

export default Layout;
