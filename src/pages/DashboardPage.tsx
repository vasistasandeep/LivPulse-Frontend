import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Grid,
  Card,
  CardContent,
  Alert,
  Button,
  Chip
} from '@mui/material';
import {
  Dashboard,
  Devices,
  Storage,
  Cloud,
  ContentPaste,
  BugReport,
  Assignment,
  Refresh,
  Download,
  Movie
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { dashboardAPI } from '../api/dashboardAPI';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/Shared/LoadingSpinner';
import MetricCard from '../components/Shared/MetricCard';
import PlatformTab from '../components/Tabs/PlatformTab';
import BackendServicesTab from '../components/Tabs/BackendServicesTab';
import OpsCDNTab from '../components/Tabs/OpsCDNTab';
import PublishingTab from '../components/Tabs/PublishingTab';
import CMSTab from '../components/Tabs/CMSTab';
import BugsTab from '../components/Tabs/BugsTab';
import SprintFeaturesTab from '../components/Tabs/SprintFeaturesTab';
import ProgramDetailsTab from '../components/Tabs/ProgramDetailsTab';

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
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
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

const DashboardPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const { isExecutive } = useAuth();

  // Fetch dashboard overview data
  const { 
    data: overviewData, 
    isLoading: overviewLoading, 
    error: overviewError,
    refetch: refetchOverview 
  } = useQuery({
    queryKey: ['dashboard-overview'],
    queryFn: () => dashboardAPI.getOverview(),
    refetchInterval: 30000, // Refresh every 30 seconds
    retry: 2, // Retry failed requests twice before showing an error
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
  });

  // Fetch alerts
  const { 
    data: alertsData, 
    isLoading: alertsLoading,
    error: alertsError,
    refetch: refetchAlerts 
  } = useQuery({
    queryKey: ['dashboard-alerts'],
    queryFn: () => dashboardAPI.getAlerts(),
    refetchInterval: 15000, // Refresh every 15 seconds
    retry: 2, // Retry failed requests twice before showing an error
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
  });

  // Handle retry for failed requests
  const handleRetry = () => {
    refetchOverview();
    refetchAlerts();
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleExportReport = async () => {
    try {
      const response = await dashboardAPI.getExecutiveReport('pdf');
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `executive-report-${new Date().toISOString().split('T')[0]}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const tabs = [
    { label: 'Program Overview', icon: <Dashboard />, component: <ProgramDetailsTab /> },
    { label: 'Sprint Features', icon: <Assignment />, component: <SprintFeaturesTab /> },
    { label: 'Bugs Analytics', icon: <BugReport />, component: <BugsTab /> },
    { label: 'Backend Services', icon: <Storage />, component: <BackendServicesTab /> },
    { label: 'Platform Analytics', icon: <Devices />, component: <PlatformTab /> },
    { label: 'Content Publishing', icon: <Movie />, component: <PublishingTab /> },
    { label: 'CMS Metrics', icon: <ContentPaste />, component: <CMSTab /> },
    { label: 'Ops & CDN', icon: <Cloud />, component: <OpsCDNTab /> },
  ];

  if (overviewLoading || alertsLoading) {
    return <LoadingSpinner size={60} message="Loading dashboard..." />;
  }
  const overview = overviewData?.data?.data;
  const alerts = alertsData?.data?.data;

  return (
    <Box>
      {(overviewError || alertsError) && (
        <Box p={2}>
          <Alert 
            severity="error" 
            action={
              <Button 
                color="inherit" 
                size="small" 
                onClick={handleRetry}
                disabled={overviewLoading || alertsLoading}
              >
                Retry
              </Button>
            }
          >
            Failed to load dashboard data. Please try again.
          </Alert>
        </Box>
      )}
      
      <Box display="flex" gap={2} p={2}>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={() => {
            refetchOverview();
            refetchAlerts();
          }}
          disabled={overviewLoading || alertsLoading}
        >
          Refresh
        </Button>
          {isExecutive && (
            <Button
              variant="contained"
              startIcon={<Download />}
              onClick={handleExportReport}
            >
              Export Report
            </Button>
          )}
        </Box>

      {/* Executive Summary (for Overview tab) */}
      {tabValue === 0 && overview && (
        <Box mb={4}>
          <Typography variant="h5" gutterBottom>
            Program Health Summary
          </Typography>
          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Overall Health Score"
                value={`${overview.summary.healthScore}%`}
                status={overview.summary.overallHealth}
                trend={{
                  direction: 'up',
                  value: 2.5,
                  label: 'vs last week'
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Healthy Platforms"
                value={`${overview.summary.keyMetrics.platformsHealthy}/5`}
                subtitle="Platforms operational"
                status="healthy"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Services Operational"
                value={`${overview.summary.keyMetrics.servicesOperational}/6`}
                subtitle="Backend services"
                status="healthy"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Critical Issues"
                value={overview.summary.keyMetrics.criticalIssues}
                subtitle="Require immediate attention"
                status={overview.summary.keyMetrics.criticalIssues > 0 ? 'critical' : 'healthy'}
              />
            </Grid>
          </Grid>

          {/* Top Concerns */}
          {overview.summary.topConcerns && overview.summary.topConcerns.length > 0 && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Top Concerns
                </Typography>
                {overview.summary.topConcerns.map((concern: string, index: number) => (
                  <Alert key={index} severity="warning" sx={{ mb: 1 }}>
                    {concern}
                  </Alert>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Recent Alerts */}
          {alerts && alerts.alerts && alerts.alerts.length > 0 && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Alerts ({alerts.summary.total})
                </Typography>
                <Box display="flex" gap={1} mb={2}>
                  <Chip label={`Critical: ${alerts.summary.critical}`} color="error" size="small" />
                  <Chip label={`High: ${alerts.summary.high}`} color="warning" size="small" />
                  <Chip label={`Medium: ${alerts.summary.medium}`} color="info" size="small" />
                </Box>
                {alerts.alerts.slice(0, 5).map((alert: any, index: number) => (
                  <Alert 
                    key={index} 
                    severity={alert.severity === 'critical' ? 'error' : 
                             alert.severity === 'high' ? 'warning' : 'info'} 
                    sx={{ mb: 1 }}
                  >
                    <strong>{alert.title}</strong> - {alert.description}
                  </Alert>
                ))}
              </CardContent>
            </Card>
          )}
        </Box>
      )}

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="dashboard tabs"
        >
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              icon={tab.icon}
              label={tab.label}
              iconPosition="start"
              id={`dashboard-tab-${index}`}
              aria-controls={`dashboard-tabpanel-${index}`}
            />
          ))}
        </Tabs>
      </Box>

      {/* Tab Panels */}
      {tabs.map((tab, index) => (
        <TabPanel key={index} value={tabValue} index={index}>
          {tab.component}
        </TabPanel>
      ))}
    </Box>
  );
};

export default DashboardPage;
