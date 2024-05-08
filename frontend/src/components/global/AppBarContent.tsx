import MenuIcon from '@mui/icons-material/Menu';
import {Box, IconButton, Toolbar} from '@mui/material';
import React, {useContext, useEffect, useState} from 'react';

import SidebarContext from "../../contexts/SidebarContext";
import Logo from '../common/Logo';
import AppBar from './AppBar';

interface AppBarContentProps {
  open: boolean;
  toggleDrawer: () => void;
  pageTitle?: string;
  content?: React.ReactNode;
}

function AppBarContent({open, pageTitle, content, toggleDrawer}: AppBarContentProps) {
  const {sidebarWidth} = useContext(SidebarContext);
  const [showLogo, setShowLogo] = useState(true);
  const [showTitle, setShowTitle] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      const rightSectionWidth = windowWidth - sidebarWidth;
      sidebarWidth / windowWidth <= 0.5 ? setShowLogo(true) : setShowLogo(false);
      sidebarWidth / windowWidth <= 0.7 ? setShowTitle(true) : setShowTitle(false);
      if (open && rightSectionWidth < 600) {
        setShowLogo(false);
        setShowTitle(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [sidebarWidth]);

  return (
    <AppBar position="absolute" sidebarWidth={sidebarWidth} open={open}>
      <Toolbar
        sx={{
          pr: '28px',
          justifyContent: 'space-between',
        }}
      >
        <IconButton
          edge="start"
          color="inherit"
          onClick={toggleDrawer}
          sx={{
            marginRight: '36px',
            ...(open && {display: 'none'}),
          }}
        >
          <MenuIcon/>
        </IconButton>
        {showTitle ?
          <Box>{pageTitle}</Box>
          : <Box/>}
        {showLogo && <Logo/>}
        <Box>
          {content}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default AppBarContent;
