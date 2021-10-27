import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { useHistory } from 'react-router';

export const Header = () => {
  const history = useHistory();
  return (
    <Box
      id='logo-mobile'
      sx={{
        padding: 2,
        cursor: 'pointer',
        display: { xs: 'block', sm: 'none' },
        textAlign: 'center',
      }}
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
  );
};
