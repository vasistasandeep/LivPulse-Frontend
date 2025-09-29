import React from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Alert
} from '@mui/material';
import {
  Store,
  PhoneAndroid,
  Tv,
  Business
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { dashboardAPI } from '../../api/dashboardAPI';
import LoadingSpinner from '../Shared/LoadingSpinner';
import MetricCard from '../Shared/MetricCard';
import ChartContainer from '../Shared/ChartContainer';

const StoreTab: React.FC = () => {
  const { data: storeData, isLoading } = useQuery({
    queryKey: ['store-metrics'],
    queryFn: () => dashboardAPI.getStoreMetrics()
  });

  const { data: storeKPIs } = useQuery({
    queryKey: ['store-kpis'],
    queryFn: () => dashboardAPI.getStoreKPIs()
  });

  const { data: storeComparison } = useQuery({
    queryKey: ['store-comparison'],
    queryFn: () => dashboardAPI.getStoreComparison()
  });

  const { data: storeAlerts } = useQuery({
    queryKey: ['store-alerts'],
    queryFn: () => dashboardAPI.getStoreAlerts()
  });

  if (isLoading) {
    return <LoadingSpinner message="Loading store metrics..." />;
  }

  const stores = storeData?.data?.data || [];
  const kpis = storeKPIs?.data?.data || {};
  const comparison = storeComparison?.data?.data || {};
  const alerts = storeAlerts?.data?.data || [];

  const getStoreIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'web store':
        return <Store />;
      case 'mobile store':
        return <PhoneAndroid />;
      case 'tv store':
        return <Tv />;
      case 'partner store':
        return <Business />;
      default:
        return <Store />;
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy':
        return 'success';
      case 'warning':
        return 'warning';
      case 'critical':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Digital Storefront (Bolt)
      </Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom>
        Monitor e-commerce performance across Web, Mobile, TV, and Partner stores.
      </Typography>

      {/* KPI Summary */}
      {kpis.summary && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Total Revenue"
              value={`$${(kpis.summary.totalRevenue / 1000000).toFixed(1)}M`}
              trend={{
                direction: 'up',
                value: 8.5,
                label: 'vs last month'
              }}
              status="healthy"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Total Transactions"
              value={kpis.summary.totalTransactions.toLocaleString()}
              subtitle="This month"
              status="healthy"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Avg Conversion Rate"
              value={`${kpis.summary.avgConversionRate}%`}
              subtitle="Across all stores"
              status={kpis.summary.avgConversionRate >= 3 ? 'healthy' : 'warning'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Total Users"
              value={(kpis.summary.totalUsers / 1000000).toFixed(1) + 'M'}
              subtitle="Unique visitors"
              status="healthy"
            />
          </Grid>
        </Grid>
      )}

      {/* Subscription Metrics */}
      {kpis.subscriptions && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Subscription Metrics
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="success.main">
                    {kpis.subscriptions.newSubscriptions.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    New Subscriptions
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="primary">
                    {kpis.subscriptions.renewals.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Renewals
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="error.main">
                    {kpis.subscriptions.cancellations.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Cancellations
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="info.main">
                    {kpis.subscriptions.netGrowth.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Net Growth
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Store Performance Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stores.map((store: any, index: number) => (
          <Grid item xs={12} sm={6} md={6} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Box display="flex" alignItems="center">
                    {getStoreIcon(store.platform)}
                    <Typography variant="h6" sx={{ ml: 1 }}>
                      {store.platform}
                    </Typography>
                  </Box>
                  <Chip
                    label={store.health}
                    color={getHealthColor(store.health) as any}
                    size="small"
                  />
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Revenue
                    </Typography>
                    <Typography variant="h6">
                      ${(store.business.revenue / 1000).toFixed(0)}K
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Transactions
                    </Typography>
                    <Typography variant="h6">
                      {store.business.transactions.toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Conversion Rate
                    </Typography>
                    <Typography variant="h6" color={store.performance.conversionRate >= 3 ? 'success.main' : 'warning.main'}>
                      {store.performance.conversionRate}%
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Uptime
                    </Typography>
                    <Typography variant="h6" color={store.performance.uptime >= 99.5 ? 'success.main' : 'warning.main'}>
                      {store.performance.uptime}%
                    </Typography>
                  </Grid>
                </Grid>

                <Box mt={2}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Payment Success Rate
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <LinearProgress
                      variant="determinate"
                      value={store.payments.successRate}
                      sx={{ flexGrow: 1, mr: 1 }}
                      color={store.payments.successRate >= 95 ? 'success' : 
                             store.payments.successRate >= 90 ? 'warning' : 'error'}
                    />
                    <Typography variant="body2">
                      {store.payments.successRate}%
                    </Typography>
                  </Box>
                </Box>

                <Box mt={1}>
                  <Typography variant="caption" color="textSecondary">
                    Unique Visitors: {store.user.uniqueVisitors.toLocaleString()} | 
                    Bounce Rate: {store.user.bounceRate}%
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Alerts */}
      {alerts.length > 0 && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Store Alerts ({alerts.length})
            </Typography>
            {alerts.slice(0, 5).map((alert: any, index: number) => (
              <Alert
                key={index}
                severity={alert.severity === 'critical' ? 'error' : 
                         alert.severity === 'high' ? 'warning' : 'info'}
                sx={{ mb: 1 }}
              >
                <strong>{alert.platform} - {alert.title}</strong>: {alert.description}
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {comparison.revenue && (
          <Grid item xs={12} md={6}>
                        <ChartContainer
              title="Revenue Breakdown"
              subtitle="Revenue by platform"
              data={comparison.revenue}
              type="bar"
              dataKey="revenue"
              xAxisKey="platform"
              colors={['#4caf50']}
            >
              <BarChart data={comparison.revenue} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="platform" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#4caf50" />
              </BarChart>
            </ChartContainer>
          </Grid>
        )}

        {comparison.conversion && (
          <Grid item xs={12} md={6}>
            <ChartContainer
              title="Conversion Rates"
              subtitle="Conversion rate by platform"
              data={comparison.conversion}
              type="bar"
              dataKey="rate"
              xAxisKey="platform"
              colors={['#2196f3']}
            >
              <BarChart data={comparison.conversion} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="platform" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="rate" fill="#2196f3" />
              </BarChart>
            </ChartContainer>
          </Grid>
        )}

        {comparison.users && (
          <Grid item xs={12} md={6}>
            <ChartContainer
              title="User Engagement"
              subtitle="Sessions vs unique visitors"
              data={comparison.users}
              type="bar"
              dataKey="sessions"
              xAxisKey="platform"
              colors={['#ff9800']}
            >
              <BarChart data={comparison.users} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="platform" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sessions" fill="#ff9800" />
              </BarChart>
            </ChartContainer>
          </Grid>
        )}

        {comparison.performance && (
          <Grid item xs={12} md={6}>
            <ChartContainer
              title="Performance Metrics"
              subtitle="Uptime by platform"
              data={comparison.performance}
              type="bar"
              dataKey="uptime"
              xAxisKey="platform"
              colors={['#9c27b0']}
            >
              <BarChart data={comparison.performance} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="platform" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="uptime" fill="#9c27b0" />
              </BarChart>
            </ChartContainer>
          </Grid>
        )}
      </Grid>

      {/* Payment Health Summary */}
      {kpis.paymentHealth && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Payment Health Summary
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box textAlign="center">
                  <Typography variant="h4" color="success.main">
                    {kpis.paymentHealth.avgSuccessRate.toFixed(1)}%
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Average Success Rate
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box textAlign="center">
                  <Typography variant="h4" color="primary">
                    {kpis.paymentHealth.avgProcessingTime.toFixed(1)}s
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Average Processing Time
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box textAlign="center">
                  <Typography variant="h4" color="warning.main">
                    {kpis.paymentHealth.totalFraudDetected.toFixed(1)}%
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Fraud Detection Rate
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default StoreTab;
