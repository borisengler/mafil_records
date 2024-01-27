import { Box, Toolbar, useTheme } from '@mui/material';
import React from 'react';

import LoadingBox from './LoadingBox';
import Message from './Message';

interface ListItemsProps {
  loading: boolean;
  list: JSX.Element[];
  loadingMessage: string;
  errorMessage: string | null;
}

const ListItems: React.FC<ListItemsProps> = ({ loading, list, loadingMessage, errorMessage }) => {
  const theme = useTheme();

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        overflow: 'auto',
        height: '100vh',
      }}
    >
      <Toolbar sx={{ minHeight: theme.mixins.toolbar.minHeight }} />
      {loading ? (
        <LoadingBox loadingMessage={loadingMessage} />
      ) : errorMessage ? (
        <Box flexDirection={'column'}>
          <Message title='Error' text={errorMessage} />
          {list}
        </Box>
      ) : (
        <Box flexDirection={'column'}>
          {list}
        </Box>
      )}
    </Box>
  );
};

export default ListItems;
