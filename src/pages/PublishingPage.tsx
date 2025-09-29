import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Alert,
  Tabs,
  Tab,
  Tooltip,
  IconButton,
  Fab,
  Fade,
} from '@mui/material';
import {
  Publish,
  Movie,
  LiveTv,
  VideoLibrary,
  Add,
  InfoOutlined,
  CloudUpload,
  Schedule,
  Analytics,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import PublishingTab from '../components/Tabs/PublishingTab';
import LoadingSpinner from '../components/Shared/LoadingSpinner';

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
      id={`publishing-tabpanel-${index}`}
      aria-labelledby={`publishing-tab-${index}`}
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

const PublishingPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [showTooltips, setShowTooltips] = useState(true);
  const { user, hasInputAccess, isAdmin } = useAuth();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const dismissTooltips = () => {
    setShowTooltips(false);
    localStorage.setItem('livpulse-publishing-tooltips-dismissed', 'true');
  };

  React.useEffect(() => {
    const dismissed = localStorage.getItem('livpulse-publishing-tooltips-dismissed');
    if (dismissed) {
      setShowTooltips(false);
    }
  }, []);

  const publishingTabs = [
    {
      label: 'Publishing Overview',
      icon: <Publish />,
      component: <PublishingTab />,
      description: 'Comprehensive overview of all publishing activities'
    },
    {
      label: 'VOD Management',
      icon: <Movie />,
      component: (
        <Box>
          <Typography variant="h5" gutterBottom>VOD Content Management</Typography>
          <Typography variant="body1" color="text.secondary">
            Video-on-Demand content publishing, scheduling, and delivery management tools.
          </Typography>
          <Alert severity="info" sx={{ mt: 2 }}>
            VOD management features coming soon. This will include content upload, metadata management, 
            scheduling, and delivery tracking.
          </Alert>
        </Box>
      ),
      description: 'Manage VOD content publishing and delivery'
    },
    {
      label: 'Live Streaming',
      icon: <LiveTv />,
      component: (
        <Box>
          <Typography variant="h5" gutterBottom>Live Streaming Control</Typography>
          <Typography variant="body1" color="text.secondary">
            Live streaming management, scheduling, and monitoring dashboard.
          </Typography>
          <Alert severity="info" sx={{ mt: 2 }}>
            Live streaming controls coming soon. This will include stream setup, monitoring, 
            viewer analytics, and quality management.
          </Alert>
        </Box>
      ),
      description: 'Control live streaming and broadcast management'
    },
    {
      label: 'Shorts Hub',
      icon: <VideoLibrary />,
      component: (
        <Box>
          <Typography variant="h5" gutterBottom>Shorts Publishing Hub</Typography>
          <Typography variant="body1" color="text.secondary">
            Short-form content creation, optimization, and distribution tools.
          </Typography>
          <Alert severity="info" sx={{ mt: 2 }}>
            Shorts publishing tools coming soon. This will include quick upload, 
            auto-optimization, trending analysis, and distribution management.
          </Alert>
        </Box>
      ),
      description: 'Manage short-form content publishing'
    },
    {
      label: 'Analytics',
      icon: <Analytics />,
      component: (
        <Box>
          <Typography variant="h5" gutterBottom>Publishing Analytics</Typography>
          <Typography variant="body1" color="text.secondary">
            Detailed analytics and insights for all published content across platforms.
          </Typography>
          <Alert severity="info" sx={{ mt: 2 }}>
            Publishing analytics dashboard coming soon. This will include performance metrics, 
            audience insights, revenue tracking, and engagement analysis.
          </Alert>
        </Box>
      ),
      description: 'Analyze publishing performance and metrics'
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
          <Publish sx={{ fontSize: '2rem' }} />
          Publishing Hub
          {showTooltips && (
            <Fade in={showTooltips}>
              <Tooltip 
                title="Welcome to the Publishing Hub! This is your central control panel for all OTT content publishing. Click to dismiss tooltips."
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
          Comprehensive OTT content publishing and management platform for VOD, Live, and Shorts
        </Typography>
        
        <Card sx={{ mt: 2, bgcolor: 'success.50', border: '1px solid', borderColor: 'success.200' }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Chip 
                  label={`User: ${user?.name}`} 
                  color="success" 
                  variant="outlined"
                />
              </Grid>
              <Grid item>
                <Chip 
                  label={`Role: ${user?.role?.toUpperCase()}`} 
                  color="primary"
                />
              </Grid>
              <Grid item>
                <Chip 
                  label={hasInputAccess ? "Input Access" : "Read Only"} 
                  color={hasInputAccess ? "success" : "default"}
                />
              </Grid>
              {isAdmin && (
                <Grid item>
                  <Typography variant="caption" color="text.secondary">
                    Full publishing control enabled
                  </Typography>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
      </Box>

      {/* Quick Actions */}
      <Box mb={3}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ cursor: 'pointer', '&:hover': { elevation: 4 } }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <CloudUpload color="primary" sx={{ fontSize: '2rem', mb: 1 }} />
                <Typography variant="h6" gutterBottom>Upload Content</Typography>
                <Typography variant="body2" color="text.secondary">
                  Upload new VOD content or prepare live streams
                </Typography>
                <Button size="small" sx={{ mt: 1 }} disabled={!hasInputAccess}>
                  {hasInputAccess ? 'Upload' : 'Access Required'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ cursor: 'pointer', '&:hover': { elevation: 4 } }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Schedule color="info" sx={{ fontSize: '2rem', mb: 1 }} />
                <Typography variant="h6" gutterBottom>Schedule Release</Typography>
                <Typography variant="body2" color="text.secondary">
                  Schedule content for future publishing
                </Typography>
                <Button size="small" sx={{ mt: 1 }} disabled={!hasInputAccess}>
                  {hasInputAccess ? 'Schedule' : 'Access Required'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ cursor: 'pointer', '&:hover': { elevation: 4 } }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Analytics color="success" sx={{ fontSize: '2rem', mb: 1 }} />
                <Typography variant="h6" gutterBottom>View Analytics</Typography>
                <Typography variant="body2" color="text.secondary">
                  Analyze content performance and engagement
                </Typography>
                <Button size="small" sx={{ mt: 1 }}>
                  View Reports
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ cursor: 'pointer', '&:hover': { elevation: 4 } }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Movie color="warning" sx={{ fontSize: '2rem', mb: 1 }} />
                <Typography variant="h6" gutterBottom>Content Library</Typography>
                <Typography variant="body2" color="text.secondary">
                  Browse and manage your content library
                </Typography>
                <Button size="small" sx={{ mt: 1 }}>
                  Browse
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Access Control Notice */}
      {!hasInputAccess && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Limited Access:</strong> You have read-only access to publishing data. 
            Contact your administrator for publishing permissions to upload content, schedule releases, and manage publishing workflows.
          </Typography>
        </Alert>
      )}

      {/* Publishing Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          aria-label="publishing tabs"
          sx={{
            '& .MuiTab-root': {
              minHeight: 72,
              textTransform: 'none',
              fontWeight: 600,
            }
          }}
        >
          {publishingTabs.map((tab, index) => (
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
              id={`publishing-tab-${index}`}
              aria-controls={`publishing-tabpanel-${index}`}
            />
          ))}
        </Tabs>
      </Box>

      {/* Tab Panels */}
      {publishingTabs.map((tab, index) => (
        <TabPanel key={index} value={tabValue} index={index}>
          {tab.component}
        </TabPanel>
      ))}

      {/* Floating Action Button for Quick Upload */}
      {hasInputAccess && (
        <Fab
          color="primary"
          aria-label="quick upload"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
          }}
          onClick={() => {
            // Handle quick upload
          }}
        >
          <Add />
        </Fab>
      )}
    </Box>
  );
};

export default PublishingPage;