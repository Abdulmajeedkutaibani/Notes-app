import React from 'react';

const Layout = ({ children }) => {
  return (
    <div>
      <div
        sx={{
          background: '#f9f9f9',
          width: '100%',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Layout;
