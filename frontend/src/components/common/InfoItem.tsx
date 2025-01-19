import React from 'react';
import Box from '@mui/material/Box';
import { Tooltip } from '@mui/material';

interface Props {
  label: string;
  text: string | undefined;
  hint?: string;
}

function InfoItem({label, text, hint}: Props) {
  return (
    <Tooltip title={hint} arrow>
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
    </Tooltip>
  )
}

export default InfoItem;
