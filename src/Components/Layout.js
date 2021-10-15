import React, { useState } from 'react';
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
} from '@mui/material';
import { AddCircleOutlined, SubjectOutlined } from '@mui/icons-material';
import { useHistory, useLocation } from 'react-router';
import { format } from 'date-fns';
import { Box } from '@mui/system';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth';

const drawerWidth = 240;

const menuItems = [
  {
    Text: 'My Notes',
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
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  borderRadius: '8px',
  boxShadow: 24,
  p: 4,
};

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    const userEmail = user.email;
    console.log('user ' + userEmail + ' logged in');
    // ...
  } else {
    console.log('user logged out');

    // User is signed out
    // ...
  }
});

const Layout = ({ children }) => {
  const [openLogin, setOpenLogin] = useState(false);
  const handleLoginOpen = () => setOpenLogin(true);
  const handleLoginClose = () => setOpenLogin(false);
  const [openSignUP, setOpenSignUP] = useState(false);
  const handleSignUpOpen = () => setOpenSignUP(true);
  const handleSignUpClose = () => setOpenSignUP(false);
  const [signUpEmail, setSignUpEmail] = useState();
  const [signUpPassword, setSignUpPassword] = useState();
  const [loginEmail, setLoginEmail] = useState();
  const [loginPassword, setLoginPassword] = useState();

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

  const signUpUser = () => {
    const email = signUpEmail;
    const password = signUpPassword;
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        setOpenSignUP(false);
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  };

  const signInUser = () => {
    const auth = getAuth();
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
        const errorMessage = error.message;
      });
  };
  const SignOutUser = () => {
    const auth = getAuth();
    auth.signOut().then(() => {});
  };
  return (
    <div style={{ display: 'flex' }}>
      {/* app bar */}
      <AppBar elevation={0} sx={{ width: `calc(100% - ${drawerWidth}px)` }}>
        <Toolbar>
          <Typography sx={{ flexGrow: 1 }}>
            Today is the {format(new Date(), 'do MMMM Y')}
          </Typography>

          <Button color='inherit' onClick={handleLoginOpen}>
            Login
          </Button>
          <Button color='inherit'>Account</Button>
          <Button color='inherit' onClick={handleSignUpOpen}>
            Sign Up
          </Button>
          <Button color='inherit' onClick={SignOutUser}>
            Logout
          </Button>

          {/* Login modal */}
          <Modal
            open={openLogin}
            onClose={handleLoginClose}
            aria-labelledby='modal-modal-title'
            aria-describedby='modal-modal-description'
          >
            <Box sx={style}>
              <TextField
                onChange={(e) => setLoginEmail(e.target.value)}
                label='Email'
                variant='outlined'
                color='secondary'
                fullWidth
                required
                id='login-email'
                sx={{
                  marginTop: '20px',
                  marginBottom: '20px',
                  display: 'block',
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
                id='signUp-password'
                sx={{
                  marginTop: '20px',
                  marginBottom: '20px',
                  display: 'block',
                }}
              />
              <Button
                onClick={signInUser}
                color='secondary'
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
              />
              <Button
                onClick={signUpUser}
                color='secondary'
                variant='contained'
                fullWidth
              >
                Sign Up
              </Button>
            </Box>
          </Modal>

          <Avatar
            src='../FullSizeRender.png'
            sx={{ marginLeft: theme.spacing(2) }}
          />
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
        <List>
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
