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
  maxHeight?: string;
}

const ListItems: React.FC<ListItemsProps> = ({ loading, list, loadingMessage, errorMessage, hasToolbar = true, maxHeight ='100vh'}) => {
  const theme = useTheme();

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        overflow: 'auto',
        maxHeight: maxHeight,
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
