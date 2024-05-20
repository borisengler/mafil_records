import MuiAppBar, {AppBarProps} from '@mui/material/AppBar';
import {styled} from '@mui/material/styles';

interface StyledAppBarProps extends AppBarProps {
  open?: boolean;
  sidebarWidth: number;
}

function calculateWidth(sidebarOpen: boolean | undefined, sidebarWidth: number) {
  if (sidebarOpen) {
    return {
      marginLeft: sidebarWidth,
      width: `calc(100% - ${sidebarWidth}px)`,
    }
  }
  return {};
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open' && prop !== 'sidebarWidth',
})<StyledAppBarProps>(({theme, open, sidebarWidth}) => ({
  zIndex: theme.zIndex.drawer + 1,
  ...calculateWidth(open, sidebarWidth),
}));

export default AppBar;
