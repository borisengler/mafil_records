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
      return <Navigate to="/" replace />;
    }

    if (auth.isLoading) {
      return <LoadingBox loadingMessage='Loading...' />;
    }

    return <WrappedComponent {...props} />;
  };

  return WithAuth;
}

export { withAuthentication };
