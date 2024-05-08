import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import {IconButton, Tooltip} from '@mui/material';
import React from 'react';

interface SortButtonProps {
  sortOrder?: 'asc' | 'desc';
  onClick?: () => void;
}

function SortButton({sortOrder, onClick}: SortButtonProps) {
  const tooltipText = sortOrder === 'asc' ? 'Sort series in descending order' : 'Sort series in ascending order';

  return (
    <Tooltip title={tooltipText}>
      <IconButton size="large" color="inherit" onClick={onClick}>
        {sortOrder === 'asc' ? <ArrowDownwardIcon/> : <ArrowUpwardIcon/>}
      </IconButton>
    </Tooltip>
  )
}

export default SortButton;
