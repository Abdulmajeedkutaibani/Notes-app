import React from 'react';
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
} from '@mui/material';
import { AddCircleOutlined, SubjectOutlined } from '@mui/icons-material';
import { useHistory, useLocation } from 'react-router';
import { format } from 'date-fns';

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

const Layout = ({ children }) => {
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

  return (
    <div style={{ display: 'flex' }}>
      {/* app bar */}
      <AppBar elevation={0} sx={{ width: `calc(100% - ${drawerWidth}px)` }}>
        <Toolbar>
          <Typography sx={{ flexGrow: 1 }}>
            Today is the {format(new Date(), 'do MMMM Y')}
          </Typography>
          <Typography>User</Typography>
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
