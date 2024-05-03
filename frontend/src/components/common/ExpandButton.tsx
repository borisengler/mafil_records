import { IconButton, Tooltip } from '@mui/material';
import React from 'react';
import { ExpandMore } from './CommonCard';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface SortButtonProps {
  expanded: boolean;
  onClick?: () => void;
}

function SortButton({ expanded, onClick }: SortButtonProps) {
  const tooltipText = expanded ? 'Collapse all' : 'Expand all';

  return (
    <Tooltip title={tooltipText}>
        <ExpandMore
            expand={expanded}
            onClick={onClick}
            aria-expanded={expanded}
            >
            <ExpandMoreIcon style={{ color: 'white' }} />
        </ExpandMore>
    </Tooltip>
  )
}

export default SortButton;
