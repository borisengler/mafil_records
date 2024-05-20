import {Box} from '@mui/material';
import React from 'react';

interface SidebarContentProps {
  children?: React.ReactNode;
}

function SidebarContent({children}: SidebarContentProps) {
  return (
    <Box
      gap={2}
      p={2}
      display='flex'
      flexDirection='column'
      justifyContent='flex-start'
      sx={{
        height: '100vh',
        overflow: 'auto',
      }}
    >
      {children}
    </Box>
  );
}

export default SidebarContent;
