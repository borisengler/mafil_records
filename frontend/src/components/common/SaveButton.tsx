import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import {CircularProgress, IconButton, Tooltip} from '@mui/material';
import React, {useEffect, useState} from 'react';

interface SaveButtonProps {
  saveStatus: 'idle' | 'saving' | 'success' | 'failed';
  onClick?: () => void;
}

function SaveButton({saveStatus, onClick}: SaveButtonProps) {
  const [icon, setIcon] = useState<JSX.Element>(<SaveOutlinedIcon/>);

  useEffect(() => {
    if (saveStatus === 'success') {
      setIcon(<CheckCircleIcon sx={{color: '#90ee90'}}/>);
      setTimeout(() => setIcon(<SaveOutlinedIcon/>), 3000);
    } else if (saveStatus === 'failed') {
      setIcon(<ErrorIcon sx={{color: '#ff7f7f'}}/>);
    } else if (saveStatus === 'saving') {
      setIcon(<CircularProgress color="inherit" size={24} thickness={6}/>);
    } else {
      setIcon(<SaveOutlinedIcon/>);
    }
  }, [saveStatus]);

  return (
    <Tooltip title="Save study records to database">
      <IconButton size="large" color="inherit" onClick={onClick}>
        {icon}
      </IconButton>
    </Tooltip>
  )
}

export default SaveButton;
