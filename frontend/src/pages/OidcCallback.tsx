// OIDCCallback.tsx
import React from "react";
import { Container } from "@mui/material";
import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router-dom";
import LoadingBox from "../components/common/LoadingBox";

function OIDCCallback() {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Inside OIDCCallback useEffect", auth.user, auth);
  
    const handleUserLoaded = () => {
      console.log("User loaded:", auth.user);
      if (auth.user && auth.user.profile) {
        console.log("Navigating to /studies");
        navigate("/studies");
      } else {
        // console.log("Navigating to /");
        navigate("/");
      }
    };
  
    console.log("Adding user loaded event listener");
    auth.events.addUserLoaded(handleUserLoaded);
  
    return () => {
      console.log("Cleaning up user loaded event listener");
      auth.events.removeUserLoaded(handleUserLoaded);
    };
  }, [auth, navigate]);

  return (
    <Container>
      <LoadingBox loadingMessage='Signing in.' />
    </Container>
  );
}

export default OIDCCallback;

