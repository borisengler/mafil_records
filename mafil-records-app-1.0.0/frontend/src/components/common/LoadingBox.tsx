import React from 'react';
import { CircularProgress } from "@mui/material";
import Box from '@mui/material/Box';

interface LoadingBoxProps {
  loadingMessage: string;
}

export function SmallLoadingBox({ loadingMessage }: LoadingBoxProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "left",
        alignItems: "flex-start",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", }}>
        <Box>
          <CircularProgress color="primary" thickness={8} size={35} />
        </Box>
        <Box padding={2}>{loadingMessage}</Box>
      </Box>
    </Box >
  );
}

function LoadingBox({ loadingMessage }: LoadingBoxProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "70vh",
      }}
    >
      <CircularProgress color="primary" thickness={4} size={80} />
      <Box padding={4}>{loadingMessage}</Box>
    </Box>
  );
}

export default LoadingBox;
