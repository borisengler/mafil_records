import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import {Badge, CircularProgress, IconButton, Tooltip} from '@mui/material';
import React, {useEffect, useState} from 'react';

interface RefreshButtonProps {
  onClick?: () => void;
  fetchStatus?: 'idle' | 'saving' | 'success' | 'failed';
  tooltipTitle: string;
}

function RefreshButton({onClick, fetchStatus, tooltipTitle}: RefreshButtonProps) {
  const [icon, setIcon] = useState<JSX.Element>(<RefreshIcon/>);

  useEffect(() => {
    if (fetchStatus === 'success') {
      setIcon(<CheckCircleIcon sx={{color: '#90ee90'}}/>);
      setTimeout(() => setIcon(<RefreshIcon/>), 3000);
    } else if (fetchStatus === 'failed') {
      setIcon(<ErrorIcon sx={{color: '#ff7f7f'}}/>);
    } else if (fetchStatus === 'saving') {
      setIcon(<CircularProgress color='inherit' size={24} thickness={6}/>);
    } else {
      setIcon(<RefreshIcon/>);
    }
  }, [fetchStatus]);

  return (
    <Tooltip title={tooltipTitle}>
      <IconButton size='large' color='inherit' onClick={onClick}>
        {icon}
      </IconButton>
    </Tooltip>
  )
}

export default RefreshButton;