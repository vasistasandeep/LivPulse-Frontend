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
  LinearProgress,
  Alert
} from '@mui/material';
import {
  Storage,
  List,
  PlayArrow,
  Settings,
  CloudQueue,
  AccountCircle
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { dashboardAPI } from '../../api/dashboardAPI';
import LoadingSpinner from '../Shared/LoadingSpinner';
import MetricCard from '../Shared/MetricCard';
import ChartContainer from '../Shared/ChartContainer';

const BackendServicesTab: React.FC = () => {
  const { data: backendData, isLoading } = useQuery({
    queryKey: ['backend-metrics'],
    queryFn: () => dashboardAPI.getBackendMetrics()
  });

  const { data: backendKPIs } = useQuery({
    queryKey: ['backend-kpis'],
    queryFn: () => dashboardAPI.getBackendKPIs()
  });

  const { data: backendAlerts } = useQuery({
    queryKey: ['backend-alerts'],
    queryFn: () => dashboardAPI.getBackendAlerts()
  });

  const { data: dependencies } = useQuery({
    queryKey: ['backend-dependencies'],
    queryFn: () => dashboardAPI.getBackendDependencies()
  });

  if (isLoading) {
    return <LoadingSpinner message="Loading backend services..." />;
  }

  const services = backendData?.data?.data || [];
  const kpis = backendKPIs?.data?.data || {};
  const alerts = backendAlerts?.data?.data || [];
  const deps = dependencies?.data?.data || {};

  const getServiceIcon = (service: string) => {
    switch (service.toLowerCase()) {
      case 'umsps':
        return <AccountCircle />;
      case 'listing':
        return <List />;
      case 'playback':
        return <PlayArrow />;
      case 'appconfig':
        return <Settings />;
      case 'cw':
        return <CloudQueue />;
      case 'usm':
        return <Storage />;
      default:
        return <Storage />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'success';
      case 'degraded':
        return 'warning';
      case 'outage':
        return 'error';
      case 'maintenance':
        return 'info';
      default:
        return 'default';
    }
  };


  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Backend Services
      </Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom>
        Monitor UMSPS, Listing, Playback, AppConfig, CW, and USM services performance and health.
      </Typography>

      {/* KPI Summary */}
      {kpis.summary && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Average Uptime"
              value={`${kpis.summary.avgUptime}%`}
              status={kpis.summary.avgUptime >= 99.5 ? 'healthy' : 'warning'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Operational Services"
              value={`${kpis.summary.operationalServices}/${kpis.summary.operationalServices + kpis.summary.degradedServices + kpis.summary.outageServices}`}
              subtitle="Services running normally"
              status="healthy"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Total Throughput"
              value={kpis.summary.totalThroughput.toLocaleString()}
              subtitle="Requests per minute"
              status="healthy"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="SLA Breaches"
              value={kpis.summary.slaBreaches}
              subtitle="This month"
              status={kpis.summary.slaBreaches === 0 ? 'healthy' : 'warning'}
            />
          </Grid>
        </Grid>
      )}

      {/* Service Health Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {services.map((service: any, index: number) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Box display="flex" alignItems="center">
                    {getServiceIcon(service.service)}
                    <Typography variant="h6" sx={{ ml: 1 }}>
                      {service.service}
                    </Typography>
                  </Box>
                  <Chip
                    label={service.status}
                    color={getStatusColor(service.status) as any}
                    size="small"
                  />
                </Box>

                <Box mb={2}>
                  <Typography variant="body2" color="textSecondary">
                    Uptime
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <LinearProgress
                      variant="determinate"
                      value={service.performance.uptime}
                      sx={{ flexGrow: 1, mr: 1 }}
                      color={service.performance.uptime >= 99.5 ? 'success' : 
                             service.performance.uptime >= 99 ? 'warning' : 'error'}
                    />
                    <Typography variant="body2">
                      {service.performance.uptime}%
                    </Typography>
                  </Box>
                </Box>

                <Box mb={2}>
                  <Typography variant="body2" color="textSecondary">
                    Response Time: {service.performance.responseTime}ms
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Throughput: {service.performance.throughput.toLocaleString()}/min
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Error Rate: {service.performance.errorRate}%
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Resource Usage
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    CPU: {service.resources.cpuUsage}% | Memory: {service.resources.memoryUsage}%
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
              Service Alerts ({alerts.length})
            </Typography>
            {alerts.slice(0, 5).map((alert: any, index: number) => (
              <Alert
                key={index}
                severity={alert.severity === 'critical' ? 'error' : 
                         alert.severity === 'high' ? 'warning' : 'info'}
                sx={{ mb: 1 }}
              >
                <strong>{alert.service} - {alert.title}</strong>: {alert.description}
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <ChartContainer
            title="Service Uptime Comparison"
            subtitle="Uptime percentage by service"
            data={services.map((s: any) => ({
              name: s.service,
              uptime: s.performance.uptime
            }))}
            type="bar"
            dataKey="uptime"
            xAxisKey="name"
            colors={['#4caf50']}
          >
            <BarChart width={500} height={300} data={services.map((s: any) => ({
              name: s.service,
              uptime: s.performance.uptime
            }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="uptime" fill="#4caf50" />
            </BarChart>
          </ChartContainer>
        </Grid>

        <Grid item xs={12} md={6}>
          <ChartContainer
            title="Response Time Trends"
            subtitle="Average response time by service"
            data={services.map((s: any) => ({
              name: s.service,
              responseTime: s.performance.responseTime
            }))}
            type="bar"
            dataKey="responseTime"
            xAxisKey="name"
            colors={['#2196f3']}
          >
            <BarChart width={500} height={300} data={services.map((s: any) => ({
              name: s.service,
              responseTime: s.performance.responseTime
            }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="responseTime" fill="#2196f3" />
            </BarChart>
          </ChartContainer>
        </Grid>
      </Grid>

      {/* Dependencies Health */}
      {deps.summary && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Database Health
                </Typography>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Healthy</Typography>
                  <Typography variant="body2" color="success.main">
                    {deps.summary.database.healthy}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Warning</Typography>
                  <Typography variant="body2" color="warning.main">
                    {deps.summary.database.warning}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Critical</Typography>
                  <Typography variant="body2" color="error.main">
                    {deps.summary.database.critical}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Cache Health
                </Typography>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Healthy</Typography>
                  <Typography variant="body2" color="success.main">
                    {deps.summary.cache.healthy}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Warning</Typography>
                  <Typography variant="body2" color="warning.main">
                    {deps.summary.cache.warning}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Critical</Typography>
                  <Typography variant="body2" color="error.main">
                    {deps.summary.cache.critical}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  External Services
                </Typography>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Healthy</Typography>
                  <Typography variant="body2" color="success.main">
                    {deps.summary.external.healthy}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Warning</Typography>
                  <Typography variant="body2" color="warning.main">
                    {deps.summary.external.warning}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Critical</Typography>
                  <Typography variant="body2" color="error.main">
                    {deps.summary.external.critical}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Detailed Metrics Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Detailed Service Metrics
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Service</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Uptime</TableCell>
                  <TableCell align="right">Response Time</TableCell>
                  <TableCell align="right">Throughput</TableCell>
                  <TableCell align="right">Error Rate</TableCell>
                  <TableCell align="right">CPU Usage</TableCell>
                  <TableCell align="right">Memory Usage</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {services.map((service: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        {getServiceIcon(service.service)}
                        <Typography sx={{ ml: 1 }}>{service.service}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={service.status}
                        color={getStatusColor(service.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        color={service.performance.uptime >= 99.5 ? 'success.main' : 
                               service.performance.uptime >= 99 ? 'warning.main' : 'error.main'}
                      >
                        {service.performance.uptime}%
                      </Typography>
                    </TableCell>
                    <TableCell align="right">{service.performance.responseTime}ms</TableCell>
                    <TableCell align="right">{service.performance.throughput.toLocaleString()}</TableCell>
                    <TableCell align="right">
                      <Typography
                        color={service.performance.errorRate < 1 ? 'success.main' : 
                               service.performance.errorRate < 5 ? 'warning.main' : 'error.main'}
                      >
                        {service.performance.errorRate}%
                      </Typography>
                    </TableCell>
                    <TableCell align="right">{service.resources.cpuUsage}%</TableCell>
                    <TableCell align="right">{service.resources.memoryUsage}%</TableCell>
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

export default BackendServicesTab;
