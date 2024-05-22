// OIDCCallback.tsx
import React from 'react';
import {Container} from '@mui/material';
import {useEffect} from 'react';
import {useAuth} from 'react-oidc-context';
import {useNavigate} from 'react-router-dom';
import LoadingBox from '../components/common/LoadingBox';

function OIDCCallback() {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {

    const handleUserLoaded = () => {
      if (auth.user && auth.user.profile) {
        navigate('/studies');
      } else {
        navigate('/');
      }
    };

    auth.events.addUserLoaded(handleUserLoaded);

    return () => {
      auth.events.removeUserLoaded(handleUserLoaded);
    };
  }, [auth, navigate]);

  return (
    <Container>
      <LoadingBox loadingMessage='Signing in.'/>
    </Container>
  );
}

export default OIDCCallback;

