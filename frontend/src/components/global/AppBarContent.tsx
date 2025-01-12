import MenuIcon from '@mui/icons-material/Menu';
import {Box, IconButton, Toolbar} from '@mui/material';
import React, {useContext, useEffect, useState} from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import SidebarContext from '../../contexts/SidebarContext';
import Logo from '../common/Logo';
import AppBar from './AppBar';

interface AppBarContentProps {
  open: boolean;
  toggleDrawer: () => void;
  pageTitle?: string;
  content?: React.ReactNode;
}

function AppBarContent({open, pageTitle, content, toggleDrawer}: AppBarContentProps) {

  return (
    <AppBar position='absolute' open={open}>
      <Toolbar
        sx={{
          pr: '28px',
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          {!open ?
            <IconButton
              color='inherit'
              onClick={toggleDrawer}
              sx={{
                marginRight: '10px',
              }}
            >
              <MenuIcon/>
            </IconButton> :
            <IconButton onClick={toggleDrawer}
              color='inherit'
              sx={{
                marginRight: '10px',
              }}>
              <ChevronLeftIcon/>
            </IconButton>
          }
          <Logo/>
        </Box>
          <Box>{pageTitle}</Box>
        <Box>
          {content}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default AppBarContent;
