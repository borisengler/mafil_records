import React from 'react';
import { useAuth } from 'react-oidc-context';
import { Navigate } from 'react-router-dom';
import LoadingBox from '../components/common/LoadingBox';

function withAuthentication<P extends object>(
  WrappedComponent: React.ComponentType<P>
): React.FunctionComponent<P> {
  const WithAuth: React.FC<P> = (props) => {
    const auth = useAuth();

    if (!auth.isLoading && !auth.isAuthenticated) {
      console.log('withAuthentication: is not loading and is not authenticated');
      return <Navigate to="/" replace />;
    }

    if (auth.isLoading) {
      console.log('withAuthentication: is still loading');
      return <LoadingBox loadingMessage='Loading...' />;
    }

    console.log('withAuthentication: WrappedComponent props');
    return <WrappedComponent {...props} />;
  };

  return WithAuth;
}

export { withAuthentication };
