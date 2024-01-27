import { Container } from "@mui/material";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoadingBox from "../components/common/LoadingBox";

const OidcLogout: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/");
  }, []);

  return (
    <Container>
      <LoadingBox loadingMessage='Signing out...' />
    </Container>
  );
};

export default OidcLogout;
