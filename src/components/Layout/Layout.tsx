import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Tooltip
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  Devices,
  Storage,
  Cloud,
  Publish,
  ContentPaste,
  Assessment,
  Notifications,
  AccountCircle,
  Logout,
  Settings,
  AdminPanelSettings,
  Summarize,
  InfoOutlined,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const drawerWidth = 240;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isExecutive, isAdmin, hasInputAccess } = useAuth();

  const menuItems = [
    { text: 'Platform Summary', icon: <Summarize />, path: '/summary', roles: ['all'] },
    { text: 'Analytics Dashboard', icon: <Dashboard />, path: '/dashboard', roles: ['all'] },
    { text: 'Admin Panel', icon: <AdminPanelSettings />, path: '/admin', roles: ['admin'] },
    { text: 'Publishing Hub', icon: <Publish />, path: '/publishing', roles: ['admin', 'pm', 'tpm', 'em'] },
    { text: 'Platform Analytics', icon: <Devices />, path: '/platforms', roles: ['all'] },
    { text: 'Backend Services', icon: <Storage />, path: '/backend', roles: ['admin', 'sre', 'em'] },
    { text: 'Operations', icon: <Cloud />, path: '/operations', roles: ['admin', 'sre', 'em'] },
    { text: 'CMS', icon: <ContentPaste />, path: '/cms', roles: ['admin', 'pm', 'tpm'] },
    { text: 'Reports', icon: <Assessment />, path: '/reports', roles: ['all'] },
  ].filter(item => {
    if (item.roles.includes('all')) return true;
    if (item.roles.includes('admin') && isAdmin) return true;
    if (item.roles.includes(user?.role || '')) return true;
    return false;
  });

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
  };

  const drawer = (
    <div>
      <Toolbar>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Livpulse
          </Typography>
          <Tooltip title="OTT Publishing & Program Management Platform">
            <InfoOutlined fontSize="small" color="action" />
          </Tooltip>
        </Box>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {menuItems.find(item => item.path === location.pathname)?.text || 'Dashboard'}
          </Typography>
          
          {/* Role Badge */}
          <Tooltip title={`Logged in as ${user?.role?.toUpperCase()}`}>
            <Badge
              badgeContent={user?.role?.toUpperCase()}
              color={isAdmin ? 'error' : isExecutive ? 'warning' : 'secondary'}
              sx={{ mr: 2 }}
            >
              <Box />
            </Badge>
          </Tooltip>

          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton color="inherit" sx={{ mr: 1 }}>
              <Badge badgeContent={3} color="error">
                <Notifications />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* User Menu */}
          <Tooltip title="Account">
            <IconButton
              color="inherit"
              onClick={handleMenuClick}
              sx={{ p: 0 }}
            >
              <Avatar sx={{ bgcolor: 'secondary.main' }}>
                {user?.name.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
          </Tooltip>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
          >
            <MenuItem>
              <ListItemIcon>
                <AccountCircle fontSize="small" />
              </ListItemIcon>
              <ListItemText>
                <Typography variant="body2">{user?.name}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {user?.email}
                </Typography>
              </ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => {
              handleMenuClose();
              navigate('/admin');
            }}>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          backgroundColor: 'background.default',
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
