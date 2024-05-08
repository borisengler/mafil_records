import {Box, Toolbar, useTheme} from '@mui/material';
import React from 'react';
import Message from '../components/common/Message';
import CommonAppBar from '../components/global/AppBarContent';
import {ResizableSidebar} from '../components/global/ResizableSidebar';
import {SidebarProvider} from '../contexts/SidebarContext';
import {BlueButton} from '../components/common/Buttons';
import LoginButton from '../components/common/LoginButton';
import {withAuthentication} from '../utils/WithAuthentication';

function SuccessfulVisit() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <SidebarProvider>
      <React.Fragment>
        <CommonAppBar
          open={open}
          toggleDrawer={toggleDrawer}
        />
        <ResizableSidebar
          open={open}
          toggleDrawer={toggleDrawer}
        >
          <LoginButton/>
          <BlueButton text='Start visit' path='/studies'/>
        </ResizableSidebar>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            overflow: 'auto',
            height: '100vh',
          }}
        >
          <Toolbar sx={{minHeight: theme.mixins.toolbar.minHeight}}/>
          <Message title='Study saved successfully'
                   text='Study has been successfully saved to the database. You may log out or choose another visit.'/>
        </Box>
      </React.Fragment>
    </SidebarProvider>
  );
}

const ProtectedSuccessfulVisit = SuccessfulVisit;
export default ProtectedSuccessfulVisit