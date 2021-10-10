import React from 'react';
import { Typography, Drawer } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { display } from '@mui/system';

const drawerWidth = 240;

const classes = {
  page: {
    background: '#f9f9f9',
    width: '100%',
  },
};

const Layout = ({ children }) => {
  return (
    <div style={{ display: 'flex' }}>
      {/* app bar */}
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
          <Typography variant='h5'>AK Notes</Typography>
        </div>
      </Drawer>
      <div style={classes.page}>{children}</div>
    </div>
  );
};

export default Layout;
