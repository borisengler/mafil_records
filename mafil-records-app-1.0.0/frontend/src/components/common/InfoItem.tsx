import React from 'react';
import Box from '@mui/material/Box';

interface Props {
  label: string;
  text: string | undefined;
}

function InfoItem({ label, text }: Props) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}>
      <Box>
        {label}
      </Box>
      <Box
        sx={{
          fontWeight: 'bold',
          wordBreak: 'break-all'
        }}
      >
        {text ? text : ''}
      </Box>
    </Box>
  )
}

export default InfoItem;
