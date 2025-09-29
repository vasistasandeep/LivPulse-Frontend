import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
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
  ContentPaste,
  Build,
  DataObject,
  Publish,
  AccountTree
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { dashboardAPI } from '../../api/dashboardAPI';
import LoadingSpinner from '../Shared/LoadingSpinner';
import MetricCard from '../Shared/MetricCard';
import ChartContainer from '../Shared/ChartContainer';

const CMSTab: React.FC = () => {
  const { data: cmsData, isLoading } = useQuery({
    queryKey: ['cms-metrics'],
    queryFn: () => dashboardAPI.getCMSMetrics()
  });

  const { data: cmsKPIs } = useQuery({
    queryKey: ['cms-kpis'],
    queryFn: () => dashboardAPI.getCMSKPIs()
  });

  const { data: cmsProcessing } = useQuery({
    queryKey: ['cms-processing'],
    queryFn: () => dashboardAPI.getCMSProcessingStats()
  });

  const { data: cmsAlerts } = useQuery({
    queryKey: ['cms-alerts'],
    queryFn: () => dashboardAPI.getCMSAlerts()
  });

  if (isLoading) {
    return <LoadingSpinner message="Loading CMS metrics..." />;
  }

  const modules = cmsData?.data?.data || [];
  const kpis = cmsKPIs?.data?.data || {};
  const processing = cmsProcessing?.data?.data || {};
  const alerts = cmsAlerts?.data?.data || [];

  const getModuleIcon = (module: string) => {
    switch (module.toLowerCase()) {
      case 'content management':
        return <ContentPaste />;
      case 'asset pipeline':
        return <Build />;
      case 'metadata service':
        return <DataObject />;
      case 'publishing':
        return <Publish />;
      case 'workflow':
        return <AccountTree />;
      default:
        return <ContentPaste />;
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
        Content Management System (Blitz)
      </Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom>
        Monitor content management, asset pipeline, metadata service, publishing, and workflow modules.
      </Typography>

      {/* KPI Summary */}
      {kpis.summary && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Total Assets"
              value={kpis.summary.totalAssets.toLocaleString()}
              trend={{
                direction: 'up',
                value: 5.2,
                label: 'vs last month'
              }}
              status="healthy"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Published Assets"
              value={kpis.summary.publishedAssets.toLocaleString()}
              subtitle={`${kpis.summary.publishRate}% publish rate`}
              status="healthy"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Quality Score"
              value={`${kpis.summary.avgQualityScore}%`}
              subtitle="Average asset quality"
              status={kpis.summary.avgQualityScore >= 85 ? 'healthy' : 'warning'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Pending Approval"
              value={kpis.summary.pendingApproval.toLocaleString()}
              subtitle="Assets awaiting review"
              status={kpis.summary.pendingApproval < 5000 ? 'healthy' : 'warning'}
            />
          </Grid>
        </Grid>
      )}

      {/* Storage Overview */}
      {kpis.storage && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Storage Overview
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Box mb={2}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Storage Utilization ({kpis.storage.utilization}%)
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={kpis.storage.utilization}
                    sx={{ height: 10, borderRadius: 5 }}
                    color={kpis.storage.utilization < 80 ? 'success' : 
                           kpis.storage.utilization < 90 ? 'warning' : 'error'}
                  />
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">
                    Used: {kpis.storage.totalUsed}GB
                  </Typography>
                  <Typography variant="body2">
                    Available: {kpis.storage.availableSpace}GB
                  </Typography>
                  <Typography variant="body2">
                    Total: {kpis.storage.totalLimit}GB
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box textAlign="center">
                  <Typography variant="h4" color="primary">
                    {kpis.storage.totalUsed}GB
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Storage Used
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Workflow Metrics */}
      {kpis.workflow && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Workflow Performance
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="primary">
                    {kpis.workflow.activeWorkflows}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Active Workflows
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="success.main">
                    {kpis.workflow.completedToday}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Completed Today
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="info.main">
                    {kpis.workflow.avgAutomationRate}%
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Automation Rate
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="secondary.main">
                    {kpis.workflow.productivity}%
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Productivity Score
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Module Health Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {modules.map((module: any, index: number) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Box display="flex" alignItems="center">
                    {getModuleIcon(module.module)}
                    <Typography variant="h6" sx={{ ml: 1 }}>
                      {module.module}
                    </Typography>
                  </Box>
                  <Chip
                    label={module.health}
                    color={getHealthColor(module.health) as any}
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
                      value={module.performance.uptime}
                      sx={{ flexGrow: 1, mr: 1 }}
                      color={module.performance.uptime >= 99 ? 'success' : 
                             module.performance.uptime >= 98 ? 'warning' : 'error'}
                    />
                    <Typography variant="body2">
                      {module.performance.uptime}%
                    </Typography>
                  </Box>
                </Box>

                <Box mb={2}>
                  <Typography variant="body2" color="textSecondary">
                    Quality Score
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <LinearProgress
                      variant="determinate"
                      value={module.quality.assetQualityScore}
                      sx={{ flexGrow: 1, mr: 1 }}
                      color={module.quality.assetQualityScore >= 85 ? 'success' : 
                             module.quality.assetQualityScore >= 70 ? 'warning' : 'error'}
                    />
                    <Typography variant="body2">
                      {module.quality.assetQualityScore}%
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Assets: {module.content.totalAssets.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Processing Time: {module.performance.processingTime}min
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Active Users: {module.users.activeEditors}
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
              CMS Alerts ({alerts.length})
            </Typography>
            {alerts.slice(0, 5).map((alert: any, index: number) => (
              <Alert
                key={index}
                severity={alert.severity === 'critical' ? 'error' : 
                         alert.severity === 'high' ? 'warning' : 'info'}
                sx={{ mb: 1 }}
              >
                <strong>{alert.module} - {alert.title}</strong>: {alert.description}
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Processing Statistics */}
      {processing.dailyProcessing && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Daily Processing Statistics
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Module</TableCell>
                        <TableCell align="right">Completed</TableCell>
                        <TableCell align="right">Active</TableCell>
                        <TableCell align="right">Avg Time</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {processing.dailyProcessing.map((item: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>{item.module}</TableCell>
                          <TableCell align="right">{item.completed}</TableCell>
                          <TableCell align="right">{item.active}</TableCell>
                          <TableCell align="right">{item.avgTime}min</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  User Activity
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Module</TableCell>
                        <TableCell align="right">Editors</TableCell>
                        <TableCell align="right">Sessions</TableCell>
                        <TableCell align="right">Concurrent</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {processing.userActivity.map((item: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>{item.module}</TableCell>
                          <TableCell align="right">{item.activeEditors}</TableCell>
                          <TableCell align="right">{item.sessions}</TableCell>
                          <TableCell align="right">{item.concurrent}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <ChartContainer
            title="Module Performance"
            subtitle="Uptime percentage by module"
            data={modules.map((module: any) => ({
              name: module.module.split(' ')[0], // Shorten names for chart
              uptime: module.performance.uptime
            }))}
            type="bar"
            dataKey="uptime"
            xAxisKey="name"
            colors={['#4caf50']}
          >
            <BarChart width={500} height={300} data={modules.map((module: any) => ({
              name: module.module.split(' ')[0],
              uptime: module.performance.uptime
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
            title="Quality Scores"
            subtitle="Asset quality by module"
            data={modules.map((module: any) => ({
              name: module.module.split(' ')[0],
              quality: module.quality.assetQualityScore
            }))}
            type="bar"
            dataKey="quality"
            xAxisKey="name"
            colors={['#2196f3']}
          >
            <BarChart width={500} height={300} data={modules.map((module: any) => ({
              name: module.module.split(' ')[0],
              quality: module.quality.assetQualityScore
            }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="quality" fill="#2196f3" />
            </BarChart>
          </ChartContainer>
        </Grid>

        {processing.assetDistribution && (
          <Grid item xs={12} md={6}>
            <ChartContainer
              title="Asset Distribution"
              subtitle="Assets by status"
              data={[
                { name: 'Published', value: processing.assetDistribution.reduce((sum: number, item: any) => sum + item.published, 0) },
                { name: 'Pending', value: processing.assetDistribution.reduce((sum: number, item: any) => sum + item.pending, 0) },
                { name: 'Failed', value: processing.assetDistribution.reduce((sum: number, item: any) => sum + item.failed, 0) }
              ]}
              type="pie"
              dataKey="value"
              colors={['#4caf50', '#ff9800', '#f44336']}
            >
              <PieChart width={500} height={300}>
                <Pie
                  data={[
                    { name: 'Published', value: processing.assetDistribution.reduce((sum: number, item: any) => sum + item.published, 0) },
                    { name: 'Pending', value: processing.assetDistribution.reduce((sum: number, item: any) => sum + item.pending, 0) },
                    { name: 'Failed', value: processing.assetDistribution.reduce((sum: number, item: any) => sum + item.failed, 0) }
                  ]}
                  cx={250}
                  cy={150}
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {[
                    { name: 'Published', value: processing.assetDistribution.reduce((sum: number, item: any) => sum + item.published, 0) },
                    { name: 'Pending', value: processing.assetDistribution.reduce((sum: number, item: any) => sum + item.pending, 0) },
                    { name: 'Failed', value: processing.assetDistribution.reduce((sum: number, item: any) => sum + item.failed, 0) }
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#4caf50', '#ff9800', '#f44336'][index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ChartContainer>
          </Grid>
        )}

        <Grid item xs={12} md={6}>
          <ChartContainer
            title="Processing Times"
            subtitle="Average processing time by module"
            data={modules.map((module: any) => ({
              name: module.module.split(' ')[0],
              time: module.performance.processingTime
            }))}
            type="bar"
            dataKey="time"
            xAxisKey="name"
            colors={['#ff9800']}
          >
            <BarChart data={modules.map((module: any) => ({
              name: module.module.split(' ')[0],
              time: module.performance.processingTime
            }))} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="time" fill="#ff9800" />
            </BarChart>
          </ChartContainer>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CMSTab;
