import MuiAppBar, {AppBarProps} from '@mui/material/AppBar';
import {styled} from '@mui/material/styles';

interface StyledAppBarProps extends AppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open' && prop !== 'sidebarWidth',
})<StyledAppBarProps>(({theme, open, }) => ({
  zIndex: theme.zIndex.drawer + 1,
  width: '100%',
}));

export default AppBar;
