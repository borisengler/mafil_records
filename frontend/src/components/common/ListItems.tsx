import {Box, Toolbar, useTheme} from '@mui/material';
import React from 'react';

import LoadingBox from './LoadingBox';
import Message from './Message';

interface ListItemsProps {
  loading: boolean;
  list: JSX.Element[];
  loadingMessage: string;
  errorMessage: string | null;
  hasToolbar?: boolean;
  maxHeight?: string | null;
  emptyMessage?: string | null;
}

const ListItems: React.FC<ListItemsProps> = (
  {
    loading,
    list,
    loadingMessage,
    errorMessage,
    hasToolbar = true,
    maxHeight = '100vh',
    emptyMessage = null
  }) => {
  const theme = useTheme();

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        overflow: 'auto',
        maxHeight: maxHeight ? maxHeight : 'none',
        height: 'auto',
      }}
    >
      {hasToolbar && <Toolbar sx={{minHeight: theme.mixins.toolbar.minHeight}}/>}
      {loading ? (
        <LoadingBox loadingMessage={loadingMessage}/>
      ) : errorMessage ? (
        <Box flexDirection={'column'}>
          <Message title='Error' text={errorMessage}/>
          {list}
        </Box>
      ) : (
        <Box flexDirection={'column'}>
          {list.length == 0 && emptyMessage != null && <Message title={emptyMessage} text={""}/>}
          {list}
        </Box>
      )}
    </Box>
  );
};

export default ListItems;
