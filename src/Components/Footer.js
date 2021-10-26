import { Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <Typography
      variant='caption'
      sx={{
        paddingTop: 1,
        paddingBottom: 1,
        background: '#003366',
        color: 'white',
        fontWeight: 'bold',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        textAlign: 'center',
        display: { xs: 'block', sm: 'none' },
      }}
    >
      © 2021 Abdulmajeed Kutaibani <br />{' '}
      <a
        href='mailto:abodymeo@gmail.com'
        style={{ color: 'white', textDecoration: 'none' }}
      >
        abodymeo@gmail.com
      </a>
    </Typography>
  );
};
