import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
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
  LinearProgress,
  Alert
} from '@mui/material';
import {
  Cloud,
  Security,
  Visibility,
  Build,
  Public
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { dashboardAPI } from '../../api/dashboardAPI';
import LoadingSpinner from '../Shared/LoadingSpinner';
import MetricCard from '../Shared/MetricCard';
import ChartContainer from '../Shared/ChartContainer';

const OpsCDNTab: React.FC = () => {
  const { data: opsData, isLoading } = useQuery({
    queryKey: ['ops-metrics'],
    queryFn: () => dashboardAPI.getOpsMetrics()
  });

  const { data: cdnData } = useQuery({
    queryKey: ['cdn-metrics'],
    queryFn: () => dashboardAPI.getCDNMetrics()
  });

  const { data: devopsData } = useQuery({
    queryKey: ['devops-metrics'],
    queryFn: () => dashboardAPI.getDevOpsMetrics()
  });

  const { data: opsKPIs } = useQuery({
    queryKey: ['ops-kpis'],
    queryFn: () => dashboardAPI.getOpsKPIs()
  });

  const { data: opsAlerts } = useQuery({
    queryKey: ['ops-alerts'],
    queryFn: () => dashboardAPI.getOpsAlerts()
  });

  if (isLoading) {
    return <LoadingSpinner message="Loading operations metrics..." />;
  }

  const operations = opsData?.data?.data || [];
  const cdn = cdnData?.data?.data || {};
  const devops = devopsData?.data?.data || {};
  const kpis = opsKPIs?.data?.data || {};
  const alerts = opsAlerts?.data?.data || [];

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'cdn':
        return <Public />;
      case 'infrastructure':
        return <Cloud />;
      case 'devops':
        return <Build />;
      case 'security':
        return <Security />;
      case 'monitoring':
        return <Visibility />;
      default:
        return <Cloud />;
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
        Operations & CDN
      </Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom>
        Monitor infrastructure, CDN performance, DevOps metrics, security, and system monitoring.
      </Typography>

      {/* KPI Summary */}
      {kpis.summary && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Average Availability"
              value={`${kpis.summary.avgAvailability}%`}
              status={kpis.summary.avgAvailability >= 99.5 ? 'healthy' : 'warning'}
              trend={{
                direction: 'up',
                value: 0.1,
                label: 'vs last week'
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Total Incidents"
              value={kpis.summary.totalIncidents}
              subtitle="This month"
              status={kpis.summary.totalIncidents < 5 ? 'healthy' : 'warning'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Average MTTR"
              value={`${kpis.summary.avgMTTR}min`}
              subtitle="Mean time to resolution"
              status={kpis.summary.avgMTTR < 30 ? 'healthy' : 'warning'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Budget Utilization"
              value={`${kpis.summary.budgetUtilization}%`}
              subtitle="Of allocated budget"
              status={kpis.summary.budgetUtilization < 90 ? 'healthy' : 'warning'}
            />
          </Grid>
        </Grid>
      )}

      {/* CDN Performance */}
      {cdn.performance && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              CDN Performance - {cdn.provider}
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="primary">
                    {cdn.performance.globalLatency}ms
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Global Latency
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="success.main">
                    {cdn.performance.cacheHitRatio}%
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Cache Hit Ratio
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="info.main">
                    {(cdn.performance.bandwidth / 1000).toFixed(0)}GB
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Total Bandwidth
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="secondary.main">
                    {(cdn.performance.requests / 1000000).toFixed(1)}M
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Total Requests
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* Regional Performance */}
            {cdn.regions && (
              <Box mt={3}>
                <Typography variant="subtitle1" gutterBottom>
                  Regional Performance
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Region</TableCell>
                        <TableCell>Health</TableCell>
                        <TableCell align="right">Cache Hit Ratio</TableCell>
                        <TableCell align="right">Bandwidth (GB)</TableCell>
                        <TableCell align="right">Requests (M)</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {cdn.regions.map((region: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>{region.name}</TableCell>
                          <TableCell>
                            <Chip
                              label={region.health}
                              color={getHealthColor(region.health) as any}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="right">{region.cacheHitRatio}%</TableCell>
                          <TableCell align="right">{(region.bandwidth / 1000).toFixed(1)}</TableCell>
                          <TableCell align="right">{(region.requests / 1000000).toFixed(1)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      {/* DevOps Metrics */}
      {devops.deployments && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              DevOps Metrics
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Deployment Statistics
                </Typography>
                <Box mb={2}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">Total Deployments</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {devops.deployments.total}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">Success Rate</Typography>
                    <Typography variant="body2" color="success.main" fontWeight="bold">
                      {Math.round((devops.deployments.successful / devops.deployments.total) * 100)}%
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">Failed Deployments</Typography>
                    <Typography variant="body2" color="error.main">
                      {devops.deployments.failed}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2">Rollbacks</Typography>
                    <Typography variant="body2" color="warning.main">
                      {devops.deployments.rollbacks}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Pipeline Performance
                </Typography>
                <Box mb={2}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">Build Time</Typography>
                    <Typography variant="body2">{devops.pipeline.buildTime}min</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">Test Time</Typography>
                    <Typography variant="body2">{devops.pipeline.testTime}min</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">Deploy Time</Typography>
                    <Typography variant="body2">{devops.pipeline.deployTime}min</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2">Success Rate</Typography>
                    <Typography variant="body2" color="success.main">
                      {devops.pipeline.successRate}%
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Operations Categories */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {operations.map((ops: any, index: number) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Box display="flex" alignItems="center">
                    {getCategoryIcon(ops.category)}
                    <Typography variant="h6" sx={{ ml: 1 }}>
                      {ops.category}
                    </Typography>
                  </Box>
                  <Chip
                    label={ops.health}
                    color={getHealthColor(ops.health) as any}
                    size="small"
                  />
                </Box>

                <Box mb={2}>
                  <Typography variant="body2" color="textSecondary">
                    Availability
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <LinearProgress
                      variant="determinate"
                      value={ops.performance.availability}
                      sx={{ flexGrow: 1, mr: 1 }}
                      color={ops.performance.availability >= 99.5 ? 'success' : 
                             ops.performance.availability >= 99 ? 'warning' : 'error'}
                    />
                    <Typography variant="body2">
                      {ops.performance.availability}%
                    </Typography>
                  </Box>
                </Box>

                <Box mb={2}>
                  <Typography variant="body2" color="textSecondary">
                    Capacity Utilization
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <LinearProgress
                      variant="determinate"
                      value={ops.capacity.utilization}
                      sx={{ flexGrow: 1, mr: 1 }}
                      color={ops.capacity.utilization < 80 ? 'success' : 
                             ops.capacity.utilization < 90 ? 'warning' : 'error'}
                    />
                    <Typography variant="body2">
                      {ops.capacity.utilization}%
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Incidents: {ops.incidents.total} | MTTR: {ops.incidents.mttr}min
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Budget: ${ops.costs.current.toLocaleString()} / ${ops.costs.budget.toLocaleString()}
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
              Operations Alerts ({alerts.length})
            </Typography>
            {alerts.slice(0, 5).map((alert: any, index: number) => (
              <Alert
                key={index}
                severity={alert.severity === 'critical' ? 'error' : 
                         alert.severity === 'high' ? 'warning' : 'info'}
                sx={{ mb: 1 }}
              >
                <strong>{alert.category} - {alert.title}</strong>: {alert.description}
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <ChartContainer
            title="Availability by Category"
            subtitle="System availability percentage"
            data={operations.map((ops: any) => ({
              name: ops.category,
              availability: ops.performance.availability
            }))}
            type="bar"
            dataKey="availability"
            xAxisKey="name"
            colors={['#4caf50']}
          >
            <BarChart width={500} height={300} data={operations.map((ops: any) => ({
              name: ops.category,
              availability: ops.performance.availability
            }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="availability" fill="#4caf50" />
            </BarChart>
          </ChartContainer>
        </Grid>

        <Grid item xs={12} md={6}>
          <ChartContainer
            title="Capacity Utilization"
            subtitle="Resource utilization by category"
            data={operations.map((ops: any) => ({
              name: ops.category,
              utilization: ops.capacity.utilization
            }))}
            type="bar"
            dataKey="utilization"
            xAxisKey="name"
            colors={['#ff9800']}
          >
            <BarChart width={500} height={300} data={operations.map((ops: any) => ({
              name: ops.category,
              utilization: ops.capacity.utilization
            }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="utilization" fill="#ff9800" />
            </BarChart>
          </ChartContainer>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OpsCDNTab;
