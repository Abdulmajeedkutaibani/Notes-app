import { Typography } from '@mui/material';
import React from 'react';

export const Footer = () => {
  return (
    <Typography
      variant='subtitle2'
      sx={{
        paddingTop: 2,
        paddingBottom: 2,
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
      © 2021 Abdulmajeed Kutaibani <br /> abodymeo@gmail.com
    </Typography>
  );
};
