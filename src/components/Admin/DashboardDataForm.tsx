import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  Alert,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  Save,
  Refresh,
  Dashboard,
  Analytics,
  Speed,
  InfoOutlined,
  TrendingUp,
  Assessment,
} from '@mui/icons-material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { dashboardAPI } from '../../api/dashboardAPI';

interface DashboardMetrics {
  overview: {
    healthScore: number;
    platformsHealthy: number;
    servicesOperational: number;
    criticalIssues: number;
    totalUsers: number;
    dailyActiveUsers: number;
  };
  performance: {
    avgResponseTime: number;
    uptime: number;
    errorRate: number;
    throughput: number;
  };
  business: {
    totalRevenue: number;
    monthlyGrowth: number;
    conversionRate: number;
    customerSatisfaction: number;
  };
}

const DashboardDataForm: React.FC = () => {
  const [formData, setFormData] = useState<DashboardMetrics>({
    overview: {
      healthScore: 0,
      platformsHealthy: 0,
      servicesOperational: 0,
      criticalIssues: 0,
      totalUsers: 0,
      dailyActiveUsers: 0,
    },
    performance: {
      avgResponseTime: 0,
      uptime: 0,
      errorRate: 0,
      throughput: 0,
    },
    business: {
      totalRevenue: 0,
      monthlyGrowth: 0,
      conversionRate: 0,
      customerSatisfaction: 0,
    },
  });

  const [showHelp, setShowHelp] = useState(false);
  const queryClient = useQueryClient();

  // Fetch current dashboard data
  const { data: currentData, isLoading, error } = useQuery({
    queryKey: ['admin-dashboard-data'],
    queryFn: () => dashboardAPI.getOverview(),
  });

  // Save dashboard data
  const saveDataMutation = useMutation({
    mutationFn: (data: DashboardMetrics) => dashboardAPI.updateDashboardData(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard-data'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] });
    },
  });

  const handleInputChange = (section: keyof DashboardMetrics, field: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    saveDataMutation.mutate(formData);
  };

  const handleRefresh = () => {
    if (currentData?.data?.data) {
      setFormData(currentData.data.data);
    }
  };

  React.useEffect(() => {
    if (currentData?.data?.data) {
      setFormData(currentData.data.data);
    }
  }, [currentData]);

  const sections = [
    {
      key: 'overview' as keyof DashboardMetrics,
      title: 'System Overview',
      icon: <Dashboard />,
      color: 'primary.main',
      fields: [
        { key: 'healthScore', label: 'Health Score (%)', helper: 'Overall system health percentage', max: 100 },
        { key: 'platformsHealthy', label: 'Platforms Healthy', helper: 'Number of healthy platforms' },
        { key: 'servicesOperational', label: 'Services Operational', helper: 'Number of operational services' },
        { key: 'criticalIssues', label: 'Critical Issues', helper: 'Number of critical issues requiring attention' },
        { key: 'totalUsers', label: 'Total Users', helper: 'Total registered users in the system' },
        { key: 'dailyActiveUsers', label: 'Daily Active Users', helper: 'Users active in the last 24 hours' },
      ]
    },
    {
      key: 'performance' as keyof DashboardMetrics,
      title: 'Performance Metrics',
      icon: <Speed />,
      color: 'success.main',
      fields: [
        { key: 'avgResponseTime', label: 'Avg Response Time (ms)', helper: 'Average API response time in milliseconds' },
        { key: 'uptime', label: 'Uptime (%)', helper: 'System uptime percentage', max: 100 },
        { key: 'errorRate', label: 'Error Rate (%)', helper: 'Percentage of failed requests', max: 100 },
        { key: 'throughput', label: 'Throughput (req/sec)', helper: 'Requests processed per second' },
      ]
    },
    {
      key: 'business' as keyof DashboardMetrics,
      title: 'Business Metrics',
      icon: <TrendingUp />,
      color: 'info.main',
      fields: [
        { key: 'totalRevenue', label: 'Total Revenue ($)', helper: 'Total revenue generated' },
        { key: 'monthlyGrowth', label: 'Monthly Growth (%)', helper: 'Month-over-month growth percentage' },
        { key: 'conversionRate', label: 'Conversion Rate (%)', helper: 'User conversion rate percentage', max: 100 },
        { key: 'customerSatisfaction', label: 'Customer Satisfaction (%)', helper: 'Customer satisfaction score', max: 100 },
      ]
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            Dashboard Data Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Input and manage all dashboard metrics and key performance indicators
          </Typography>
        </Box>
        <Box display="flex" gap={1}>
          <FormControlLabel
            control={
              <Switch
                checked={showHelp}
                onChange={(e) => setShowHelp(e.target.checked)}
                size="small"
              />
            }
            label="Show Help"
          />
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={handleRefresh}
            disabled={isLoading}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSave}
            disabled={saveDataMutation.isPending}
          >
            Save Changes
          </Button>
        </Box>
      </Box>

      {/* Status Messages */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load current data: {error.message}
        </Alert>
      )}

      {saveDataMutation.isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to save changes: {saveDataMutation.error.message}
        </Alert>
      )}

      {saveDataMutation.isSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Dashboard data saved successfully!
        </Alert>
      )}

      {/* Form Sections */}
      <Grid container spacing={3}>
        {sections.map((section) => (
          <Grid item xs={12} md={6} lg={4} key={section.key}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Box sx={{ color: section.color, mr: 1 }}>
                    {section.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {section.title}
                  </Typography>
                  {showHelp && (
                    <Tooltip title={`Manage ${section.title.toLowerCase()} related metrics`}>
                      <IconButton size="small" sx={{ ml: 1 }}>
                        <InfoOutlined fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
                
                <Grid container spacing={2}>
                  {section.fields.map((field) => (
                    <Grid item xs={12} key={field.key}>
                      <TextField
                        fullWidth
                        size="small"
                        type="number"
                        label={field.label}
                        value={(formData[section.key] as any)[field.key] || 0}
                        onChange={(e) => handleInputChange(section.key, field.key, parseFloat(e.target.value) || 0)}
                        helperText={showHelp ? field.helper : undefined}
                        InputProps={{
                          inputProps: { 
                            min: 0,
                            max: field.max,
                            step: field.key.includes('Rate') || field.key.includes('Growth') ? 0.01 : 1
                          }
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions */}
      <Box mt={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Assessment />
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    // Reset to default values
                    setFormData({
                      overview: { healthScore: 95, platformsHealthy: 5, servicesOperational: 6, criticalIssues: 0, totalUsers: 1000, dailyActiveUsers: 350 },
                      performance: { avgResponseTime: 150, uptime: 99.9, errorRate: 0.1, throughput: 1000 },
                      business: { totalRevenue: 50000, monthlyGrowth: 12.5, conversionRate: 3.2, customerSatisfaction: 88 }
                    });
                  }}
                >
                  Load Sample Data
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  size="small"
                  color="warning"
                  onClick={() => {
                    setFormData({
                      overview: { healthScore: 0, platformsHealthy: 0, servicesOperational: 0, criticalIssues: 0, totalUsers: 0, dailyActiveUsers: 0 },
                      performance: { avgResponseTime: 0, uptime: 0, errorRate: 0, throughput: 0 },
                      business: { totalRevenue: 0, monthlyGrowth: 0, conversionRate: 0, customerSatisfaction: 0 }
                    });
                  }}
                >
                  Clear All Data
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default DashboardDataForm;