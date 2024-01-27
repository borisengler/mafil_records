import React from "react";
import { useAuth } from "react-oidc-context";

import { useNavigate } from "react-router-dom";
import { BlueButton, RedButton } from "./Buttons";
import InfoItem from "./InfoItem";
import { SmallLoadingBox } from "./LoadingBox";

function LoginButton() {
  const auth = useAuth();
  const navigate = useNavigate();

  function handleLogin() {
    auth.signinRedirect();
  }

  function handleLogout() {
    auth.signoutSilent();
    navigate('/oidc-logout');
  }

  switch (auth.activeNavigator) {
    case "signinRedirect":
    case "signinSilent":
      return <SmallLoadingBox loadingMessage={"Signing in..."} />;
    case "signoutRedirect":
    case "signoutSilent":
      return <SmallLoadingBox loadingMessage={"Signing out..."} />;
  }

  if (auth.isLoading) {
    return <SmallLoadingBox loadingMessage={"Loading..."} />;
  }

  if (auth.error) {
    return <SmallLoadingBox loadingMessage={"Error..."} />;
  }

  if (auth.user) {
    return (
      <React.Fragment>
        <InfoItem label="Measuring operator" text={auth.user.profile.name} />
        <RedButton text='Log out' onClick={handleLogout} />
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <InfoItem label="Measuring operator" text="Not yet logged in" />
      <BlueButton text='Log in' onClick={handleLogin} />
    </React.Fragment>
  );
}

export default LoginButton;
