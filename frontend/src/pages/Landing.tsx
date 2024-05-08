import {Box, Toolbar, useTheme} from '@mui/material';
import React, {useEffect} from 'react';
import {useAuth} from 'react-oidc-context';
import {useNavigate} from 'react-router-dom';
import Message from '../components/common/Message';
import CommonAppBar from '../components/global/AppBarContent';
import {ResizableSidebar} from '../components/global/ResizableSidebar';
import {SidebarProvider} from '../contexts/SidebarContext';
import LoginButton from '../components/common/LoginButton';

function Landing() {
  const auth = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  function handleRefresh() {
  };

  useEffect(() => {
    if (auth && auth.user) {
      navigate('/studies');
    }
  }, [auth, navigate]);

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
        </ResizableSidebar>
        <Box
          sx={{
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar sx={{minHeight: theme.mixins.toolbar.minHeight}}/>
          <Message title='Log in to be able to choose a visit.' text=''/>
        </Box>
      </React.Fragment>
    </SidebarProvider>
  );
}

export default Landing;
