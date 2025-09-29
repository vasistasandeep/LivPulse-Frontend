import React from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  LinearProgress
} from '@mui/material';
import {
  Android,
  Apple,
  Web,
  Tv,
  ConnectedTv
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { dashboardAPI } from '../../api/dashboardAPI';
import LoadingSpinner from '../Shared/LoadingSpinner';
import MetricCard from '../Shared/MetricCard';
import ChartContainer from '../Shared/ChartContainer';

const PlatformTab = () => {
  const { data: platformData, isLoading } = useQuery({
    queryKey: ['platform-metrics'],
    queryFn: () => dashboardAPI.getPlatformMetrics()
  });

  const { data: platformKPIs } = useQuery({
    queryKey: ['platform-kpis'],
    queryFn: () => dashboardAPI.getPlatformKPIs()
  });

  const { data: platformComparison } = useQuery({
    queryKey: ['platform-comparison'],
    queryFn: () => dashboardAPI.getPlatformComparison()
  });

  if (isLoading) {
    return <LoadingSpinner message="Loading platform metrics..." />;
  }

  const platforms = platformData?.data?.data || [];
  const kpis = platformKPIs?.data?.data || {};
  const comparison = platformComparison?.data?.data || {};

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'android':
        return <Android />;
      case 'ios':
        return <Apple />;
      case 'web':
        return <Web />;
      case 'atv':
        return <Tv />;
      case 'smart tv':
        return <ConnectedTv />;
      default:
        return <Web />;
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
        Platform Metrics
      </Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom>
        Performance and health metrics across Android, iOS, Web, ATV, and Smart TV platforms.
      </Typography>

      {/* KPI Summary */}
      {kpis.summary && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Total Active Users"
              value={kpis.summary.totalUsers.toLocaleString()}
              trend={{
                direction: 'up',
                value: kpis.summary.avgGrowth,
                label: 'growth rate'
              }}
              icon={<Android />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Average Growth"
              value={`${kpis.summary.avgGrowth}%`}
              subtitle="Across all platforms"
              status="healthy"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Total Revenue"
              value={`$${(kpis.summary.totalRevenue / 1000000).toFixed(1)}M`}
              subtitle="Monthly revenue"
              status="healthy"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Avg Satisfaction"
              value={`${kpis.summary.avgSatisfaction}/5`}
              subtitle="User satisfaction score"
              status={kpis.summary.avgSatisfaction >= 4 ? 'healthy' : 'warning'}
            />
          </Grid>
        </Grid>
      )}

      {/* Platform Health Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {platforms.map((platform: any, index: number) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Box display="flex" alignItems="center">
                    {getPlatformIcon(platform.platform)}
                    <Typography variant="h6" sx={{ ml: 1 }}>
                      {platform.platform}
                    </Typography>
                  </Box>
                  <Chip
                    label={platform.health}
                    color={getHealthColor(platform.health) as any}
                    size="small"
                  />
                </Box>

                <Box mb={2}>
                  <Typography variant="body2" color="textSecondary">
                    Active Users
                  </Typography>
                  <Typography variant="h6">
                    {platform.users.active.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color={platform.users.growth > 0 ? 'success.main' : 'error.main'}>
                    {platform.users.growth > 0 ? '+' : ''}{platform.users.growth}% growth
                  </Typography>
                </Box>

                <Box mb={2}>
                  <Typography variant="body2" color="textSecondary">
                    Performance Score
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <LinearProgress
                      variant="determinate"
                      value={100 - platform.performance.errorRate - platform.performance.crashRate}
                      sx={{ flexGrow: 1, mr: 1 }}
                      color={platform.health === 'healthy' ? 'success' : 
                             platform.health === 'warning' ? 'warning' : 'error'}
                    />
                    <Typography variant="body2">
                      {Math.round(100 - platform.performance.errorRate - platform.performance.crashRate)}%
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Response Time: {platform.performance.responseTime}ms
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Crash Rate: {platform.performance.crashRate}%
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {comparison.userGrowth && (
          <Grid item xs={12} md={6}>
            <ChartContainer
              title="User Growth Comparison"
              subtitle="Active users across platforms"
              data={comparison.userGrowth}
              type="bar"
              dataKey="growth"
              xAxisKey="platform"
              colors={['#2196f3', '#4caf50', '#ff9800', '#f44336', '#9c27b0']}
            >
              <BarChart data={comparison.userGrowth} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="platform" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="growth" fill="#2196f3" />
              </BarChart>
            </ChartContainer>
          </Grid>
        )}

        {comparison.performance && (
          <Grid item xs={12} md={6}>
            <ChartContainer
              title="Performance Scores"
              subtitle="Overall performance by platform"
              data={comparison.performance}
              type="bar"
              dataKey="score"
              xAxisKey="platform"
              colors={['#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107']}
            >
              <BarChart data={comparison.performance} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="platform" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="score" fill="#4caf50" />
              </BarChart>
            </ChartContainer>
          </Grid>
        )}
      </Grid>

      {/* Detailed Metrics Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Detailed Platform Metrics
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Platform</TableCell>
                  <TableCell>Health</TableCell>
                  <TableCell align="right">Active Users</TableCell>
                  <TableCell align="right">Growth %</TableCell>
                  <TableCell align="right">Response Time</TableCell>
                  <TableCell align="right">Error Rate</TableCell>
                  <TableCell align="right">Revenue</TableCell>
                  <TableCell align="right">Satisfaction</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {platforms.map((platform: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        {getPlatformIcon(platform.platform)}
                        <Typography sx={{ ml: 1 }}>{platform.platform}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={platform.health}
                        color={getHealthColor(platform.health) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      {platform.users.active.toLocaleString()}
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        color={platform.users.growth > 0 ? 'success.main' : 'error.main'}
                      >
                        {platform.users.growth > 0 ? '+' : ''}{platform.users.growth}%
                      </Typography>
                    </TableCell>
                    <TableCell align="right">{platform.performance.responseTime}ms</TableCell>
                    <TableCell align="right">{platform.performance.errorRate}%</TableCell>
                    <TableCell align="right">
                      ${(platform.business.revenue / 1000).toFixed(0)}K
                    </TableCell>
                    <TableCell align="right">
                      {platform.features.satisfaction}/5
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PlatformTab;
