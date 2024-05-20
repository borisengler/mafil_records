import React from 'react';
import {Box} from '@mui/material';
import Button from '@mui/material/Button';
import {Link} from 'react-router-dom';

interface ButtonsProps {
  text: string;
  path?: string;
  onClick?: () => void;
}

export function BlueButton({text, path, onClick}: ButtonsProps) {
  const button = (
    <Button variant='contained' onClick={onClick}>
      {text}
    </Button>
  );

  if (path) {
    return (
      <Box>
        <Link to={path} style={{textDecoration: 'none'}}>
          {button}
        </Link>
      </Box>
    );
  }

  return <Box>{button}</Box>;
}

export function RedButton({text, path, onClick}: ButtonsProps) {
  const button = (
    <Button variant='outlined' color='error' onClick={onClick}>
      {text}
    </Button>
  );

  if (path) {
    return (
      <Box>
        <Link to={path} style={{textDecoration: 'none'}}>
          {button}
        </Link>
      </Box>
    );
  }

  return <Box>{button}</Box>;
}