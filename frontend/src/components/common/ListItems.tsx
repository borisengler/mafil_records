import { Box, Toolbar, useTheme } from '@mui/material';
import React from 'react';

import LoadingBox from './LoadingBox';
import Message from './Message';

interface ListItemsProps {
  loading: boolean;
  list: JSX.Element[];
  loadingMessage: string;
  errorMessage: string | null;
  hasToolbar?: boolean;
}

const ListItems: React.FC<ListItemsProps> = ({ loading, list, loadingMessage, errorMessage, hasToolbar = true }) => {
  const theme = useTheme();

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        overflow: 'auto',
        maxHeight: '100vh',
        height: 'auto',
      }}
    >
      { hasToolbar && <Toolbar sx={{ minHeight: theme.mixins.toolbar.minHeight }} /> }
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
