import React from "react";
import {Box} from "@mui/material";
import CommonCard from "./CommonCard";

interface MessageProps {
  title: string;
  text: string;
  error?: boolean;
}

function Message({title, text, error}: MessageProps) {
  return (
    <CommonCard>
      <Box sx={{justifyContent: 'center', textAlign: 'center'}}>
        <h1>{title}</h1>
        <Box>{text}</Box>
      </Box>
    </CommonCard>
  )
}

export default Message;