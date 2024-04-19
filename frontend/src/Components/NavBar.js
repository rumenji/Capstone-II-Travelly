import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../store/authSlice';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import AirplaneTicketIcon from '@mui/icons-material/AirplaneTicket';
import { Typography, Menu, Container, Avatar, Button, Tooltip, MenuItem } from '@mui/material';
import "./NavBar.css";

/**Navbar component - shows trips and home for logged in users, or login/register for not authenticated users
 * Drop down for user menu options and logout
 */
const NavBar = () => {
  const { userInfo, loading } = useSelector((state) => state.auth)
  const dispatch = useDispatch();

  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const navbarAvatar = userInfo && !loading ?
    <>
      <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
        <Button
          key='home'
          sx={{ my: 2, color: 'white', display: 'block' }}
        ><Link className="navLink" to="/" >Home</Link>
        </Button>
        <Button
          key='trips'
          sx={{ my: 2, color: 'white', display: 'block', textDecoration: 'none', }}
        ><Link className="navLink" to="/trips">Trips</Link>
        </Button>
      </Box>
      <Box sx={{ flexGrow: 0 }}>
        <Tooltip title="Open settings">
          <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
            <Avatar sx={{ bgcolor: "#B06500" }}>{userInfo.first_name.charAt(0).toUpperCase()}</Avatar>
          </IconButton>
        </Tooltip>
        <Menu
          sx={{ mt: '45px' }}
          id="menu-appbar"
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
        >
          <MenuItem key='account' onClick={handleCloseUserMenu}>
            <Typography textAlign="center"><Link className="navLinkMenu" to="/account">Account</Link></Typography>
          </MenuItem>
          <MenuItem key='logout' onClick={handleCloseUserMenu}>
            <Typography textAlign="center"><Link className="navLinkMenu" to="/login" onClick={() => dispatch(logout())}>Logout</Link></Typography>
          </MenuItem>

        </Menu>
      </Box>
    </>
    :
    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
      <Button
        key='login'
        sx={{ my: 2, color: 'white', display: 'block' }}
      ><Link className="navLink" to="/login">Login</Link>
      </Button>
      <Button
        key='register'
        sx={{ my: 2, color: 'white', display: 'block' }}
      ><Link className="navLink" to="/register">Register</Link>
      </Button>
    </Box>



  return (
    <AppBar position="static" sx={{ bgcolor: "#D78C3DCC" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AirplaneTicketIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}>
            Travelly
          </Typography>
          {navbarAvatar}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default NavBar