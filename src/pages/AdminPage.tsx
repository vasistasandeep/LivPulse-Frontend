import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Tabs,
  Tab,
  Alert,
  Chip,
  IconButton,
  Tooltip,
  Fade,
} from '@mui/material';
import {
  AdminPanelSettings,
  Dashboard,
  Input,
  InfoOutlined,
  Movie,
  Publish,
  Settings,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import PublishingInputForm from '../components/Admin/PublishingInputForm';
import DashboardDataForm from '../components/Admin/DashboardDataForm';
import UserManagementForm from '../components/Admin/UserManagementForm';
import SettingsForm from '../components/Admin/SettingsForm';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const AdminPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [showTooltips, setShowTooltips] = useState(true);
  const { user, isAdmin, hasFullAccess } = useAuth();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const dismissTooltips = () => {
    setShowTooltips(false);
    localStorage.setItem('livpulse-admin-tooltips-dismissed', 'true');
  };

  React.useEffect(() => {
    const dismissed = localStorage.getItem('livpulse-admin-tooltips-dismissed');
    if (dismissed) {
      setShowTooltips(false);
    }
  }, []);

  if (!hasFullAccess) {
    return (
      <Box p={4}>
        <Alert severity="error">
          <Typography variant="h6">Access Denied</Typography>
          <Typography variant="body1">
            You don't have permission to access the admin panel. Contact your administrator for access.
          </Typography>
        </Alert>
      </Box>
    );
  }

  const adminTabs = [
    {
      label: 'Publishing Data',
      icon: <Movie />,
      component: <PublishingInputForm />,
      description: 'Manage VOD, Live, and Shorts content publishing data'
    },
    {
      label: 'Dashboard Data',
      icon: <Dashboard />,
      component: <DashboardDataForm />,
      description: 'Input and manage all dashboard metrics and analytics'
    },
    {
      label: 'User Management',
      icon: <AdminPanelSettings />,
      component: <UserManagementForm />,
      description: 'Manage user accounts, roles, and permissions'
    },
    {
      label: 'Settings',
      icon: <Settings />,
      component: <SettingsForm />,
      description: 'Configure application settings and preferences'
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" gutterBottom sx={{ 
          fontWeight: 'bold', 
          color: 'primary.main',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <AdminPanelSettings sx={{ fontSize: '2rem' }} />
          Admin Panel
          {showTooltips && (
            <Fade in={showTooltips}>
              <Tooltip 
                title="Welcome to the admin panel! Use these tabs to manage all platform data. Click anywhere to dismiss these tooltips."
                arrow
                placement="right"
              >
                <IconButton 
                  size="small" 
                  color="info"
                  onClick={dismissTooltips}
                >
                  <InfoOutlined />
                </IconButton>
              </Tooltip>
            </Fade>
          )}
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Comprehensive data input and management for the Livpulse platform
        </Typography>
        
        <Card sx={{ mt: 2, bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.200' }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Chip 
                  label={`Logged in as: ${user?.name}`} 
                  color="primary" 
                  variant="outlined"
                />
              </Grid>
              <Grid item>
                <Chip 
                  label={`Role: ${user?.role?.toUpperCase()}`} 
                  color="success"
                />
              </Grid>
              <Grid item>
                <Typography variant="caption" color="text.secondary">
                  Full administrative access enabled
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          aria-label="admin panel tabs"
          sx={{
            '& .MuiTab-root': {
              minHeight: 72,
              textTransform: 'none',
              fontWeight: 600,
            }
          }}
        >
          {adminTabs.map((tab, index) => (
            <Tab
              key={index}
              icon={tab.icon}
              label={
                <Box>
                  <Typography variant="body1" fontWeight="inherit">
                    {tab.label}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {tab.description}
                  </Typography>
                </Box>
              }
              iconPosition="top"
              id={`admin-tab-${index}`}
              aria-controls={`admin-tabpanel-${index}`}
            />
          ))}
        </Tabs>
      </Box>

      {/* Tab Panels */}
      {adminTabs.map((tab, index) => (
        <TabPanel key={index} value={tabValue} index={index}>
          {tab.component}
        </TabPanel>
      ))}
    </Box>
  );
};

export default AdminPage;