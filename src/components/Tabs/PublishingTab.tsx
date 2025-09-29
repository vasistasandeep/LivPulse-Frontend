import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Alert,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Tv,
  LiveTv,
  ShortText,
  Movie,
  CloudUpload,
  PlayCircle,
  Security,
  CloudDone,
  Speed,
  Timer,
  TimerOutlined,
  Storage,
  CheckCircle,
  Error,
  HourglassEmpty,
  Translate,
  Subtitles,
  ExpandMore
} from '@mui/icons-material';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { dashboardAPI } from '../../api/dashboardAPI';
import LoadingSpinner from '../Shared/LoadingSpinner';
import MetricCard from '../Shared/MetricCard';
import ChartContainer from '../Shared/ChartContainer';

const PublishingTab: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  
  const { data: publishingData, isLoading: metricsLoading } = useQuery({
    queryKey: ['publishing-metrics'],
    queryFn: () => dashboardAPI.getPublishingMetrics()
  });

  const { data: publishingKPIs, isLoading: kpisLoading } = useQuery({
    queryKey: ['publishing-kpis'],
    queryFn: () => dashboardAPI.getPublishingKPIs()
  });

  const { data: publishingComparison, isLoading: comparisonLoading } = useQuery({
    queryKey: ['publishing-trends'],
    queryFn: () => dashboardAPI.getPublishingTrends('all', 7)
  });

  const { data: vodStats } = useQuery({
    queryKey: ['vod-stats'],
    queryFn: () => dashboardAPI.getPublishingStats('vod')
  });

  const { data: liveStats } = useQuery({
    queryKey: ['live-stats'],
    queryFn: () => dashboardAPI.getPublishingStats('live')
  });

  const { data: shortsStats } = useQuery({
    queryKey: ['shorts-stats'],
    queryFn: () => dashboardAPI.getPublishingStats('shorts')
  });

  if (metricsLoading || kpisLoading || comparisonLoading) {
    return <LoadingSpinner message="Loading publishing metrics..." />;
  }

  const metrics = publishingData?.data?.data || [];
  const kpis = publishingKPIs?.data?.data || {};
  const trends = publishingComparison?.data?.data || {};
  const vodMetrics = vodStats?.data?.data || {};
  const liveMetrics = liveStats?.data?.data || {};
  const shortsMetrics = shortsStats?.data?.data || {};

  // Mock data for new features (replace with actual API data)
  const deliveryStatus = [
    { name: 'Netflix', status: 'success', details: '1,234 assets delivered' },
    { name: 'Amazon Prime', status: 'pending', details: '56 assets in queue' },
    { name: 'Disney+', status: 'success', details: '890 assets delivered' },
    { name: 'HBO Max', status: 'failed', details: '3 failed deliveries' }
  ];

  const drmStatus = [
    { type: 'Widevine', status: 'applied', details: '2,456 assets protected' },
    { type: 'FairPlay', status: 'applied', details: '1,890 assets protected' },
    { type: 'PlayReady', status: 'pending', details: '234 assets processing' }
  ];

  const subtitleTracks = [
    { language: 'English', status: 'available', details: 'SDH + CC' },
    { language: 'Spanish', status: 'available', details: 'Subtitles' },
    { language: 'French', status: 'missing', details: 'In progress' },
    { language: 'German', status: 'available', details: 'Subtitles' }
  ];

  const handleExpandSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const getContentIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'vod':
        return <Movie />;
      case 'live':
        return <LiveTv />;
      case 'shorts':
        return <ShortText />;
      default:
        return <PlayCircle />;
    }
  };

  const getStatusColor = (status: string): 'success' | 'warning' | 'error' | 'default' => {
    switch (status.toLowerCase()) {
      case 'published':
        return 'success';
      case 'processing':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box p={3}>
      {/* Alerts */}
      {kpis.alerts?.map((alert: any, index: number) => (
        <Alert severity={alert.severity} sx={{ mb: 2 }} key={index}>
          {alert.message}
        </Alert>
      ))}

      {/* KPI Summary */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <MetricCard
            title="Total Content Published"
            subtitle="Across all platforms"
            value={kpis.summary.totalPublished.toLocaleString()}
            trend={{
              direction: 'up',
              value: kpis.summary.growthRate,
              label: 'vs last period'
            }}
            icon={<CloudUpload />}
            status="healthy"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <MetricCard
            title="Success Rate"
            subtitle="Publishing success rate"
            value={`${kpis.summary.successRate}%`}
            status={kpis.summary.successRate >= 95 ? 'healthy' : 'warning'}
            icon={<Tv />}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <MetricCard
            title="Avg Processing Time"
            subtitle="Content processing"
            value={`${kpis.summary.avgProcessingTime}m`}
            status={kpis.summary.avgProcessingTime <= 30 ? 'healthy' : 'warning'}
            icon={<Movie />}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <MetricCard
            title="Live Streams"
            subtitle="Active streams"
            value={kpis.summary.activeStreams.toString()}
            status="healthy"
            icon={<LiveTv />}
          />
        </Grid>
      </Grid>

      {/* Content Publishing Trends */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <ChartContainer
            title="Content Publishing Volume"
            subtitle="Last 7 days by content type"
            data={trends.volumeByType}
            type="bar"
            dataKey="count"
            xAxisKey="date"
            colors={['#2196f3', '#4caf50', '#ff9800']}
          >
            <BarChart data={trends.volumeByType} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="vod" stackId="a" fill="#2196f3" name="VOD" />
              <Bar dataKey="live" stackId="a" fill="#4caf50" name="Live" />
              <Bar dataKey="shorts" stackId="a" fill="#ff9800" name="Shorts" />
            </BarChart>
          </ChartContainer>
        </Grid>

        <Grid item xs={12} md={6}>
          <ChartContainer
            title="Processing Success Rate"
            subtitle="Last 7 days trend"
            data={trends.successRates}
            type="line"
            dataKey="rate"
            xAxisKey="date"
            colors={['#4caf50']}
          >
            <LineChart data={trends.successRates} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="vod" stroke="#2196f3" name="VOD" />
              <Line type="monotone" dataKey="live" stroke="#4caf50" name="Live" />
              <Line type="monotone" dataKey="shorts" stroke="#ff9800" name="Shorts" />
            </LineChart>
          </ChartContainer>
        </Grid>
      </Grid>

      {/* Content Type Details */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* VOD Section */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Box display="flex" alignItems="center">
                  <Movie sx={{ mr: 1 }} />
                  <Typography variant="h6">VOD Publishing</Typography>
                </Box>
                <Chip 
                  label={`${vodMetrics.successRate || 0}% Success`}
                  color={vodMetrics.successRate >= 95 ? 'success' : 'warning'}
                  size="small"
                />
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography variant="body2" color="textSecondary">In Queue</Typography>
                  <Typography variant="h6">{vodMetrics.queueCount}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2" color="textSecondary">Processing</Typography>
                  <Typography variant="h6">{vodMetrics.processingCount}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2" color="textSecondary">Published</Typography>
                  <Typography variant="h6">{vodMetrics.publishedCount}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2" gutterBottom>Asset Status</Typography>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Paper variant="outlined" sx={{ p: 1 }}>
                        <Typography variant="caption" color="textSecondary">DRM Status</Typography>
                        <Box display="flex" alignItems="center" mt={0.5}>
                          <Security sx={{ fontSize: 16, mr: 0.5, color: 'success.main' }} />
                          <Typography variant="body2">Protected</Typography>
                        </Box>
                      </Paper>
                    </Grid>
                    <Grid item xs={6}>
                      <Paper variant="outlined" sx={{ p: 1 }}>
                        <Typography variant="caption" color="textSecondary">CDN Status</Typography>
                        <Box display="flex" alignItems="center" mt={0.5}>
                          <CloudDone sx={{ fontSize: 16, mr: 0.5, color: 'success.main' }} />
                          <Typography variant="body2">Synced</Typography>
                        </Box>
                      </Paper>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>Language Coverage</Typography>
                  <Box display="flex" gap={0.5} flexWrap="wrap">
                    {vodMetrics.languages?.map((lang: any) => (
                      <Chip
                        key={lang.code}
                        label={lang.code}
                        size="small"
                        color={lang.complete ? 'success' : 'default'}
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Live Section */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Box display="flex" alignItems="center">
                  <LiveTv sx={{ mr: 1 }} />
                  <Typography variant="h6">Live Streaming</Typography>
                </Box>
                <Chip 
                  label={`${liveMetrics.streamHealth || 0}% Health`}
                  color={liveMetrics.streamHealth >= 95 ? 'success' : 'warning'}
                  size="small"
                />
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography variant="body2" color="textSecondary">Active</Typography>
                  <Typography variant="h6">{liveMetrics.activeCount}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2" color="textSecondary">Scheduled</Typography>
                  <Typography variant="h6">{liveMetrics.scheduledCount}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2" color="textSecondary">DVR Enabled</Typography>
                  <Typography variant="h6">{liveMetrics.dvrCount}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2" gutterBottom>Stream Health</Typography>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Paper variant="outlined" sx={{ p: 1 }}>
                        <Typography variant="caption" color="textSecondary">Bitrate</Typography>
                        <Box display="flex" alignItems="center" mt={0.5}>
                          <Speed sx={{ fontSize: 16, mr: 0.5, color: 'success.main' }} />
                          <Typography variant="body2">{liveMetrics.avgBitrate}Mbps</Typography>
                        </Box>
                      </Paper>
                    </Grid>
                    <Grid item xs={6}>
                      <Paper variant="outlined" sx={{ p: 1 }}>
                        <Typography variant="caption" color="textSecondary">Latency</Typography>
                        <Box display="flex" alignItems="center" mt={0.5}>
                          <Timer sx={{ fontSize: 16, mr: 0.5, color: 'success.main' }} />
                          <Typography variant="body2">{liveMetrics.avgLatency}s</Typography>
                        </Box>
                      </Paper>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>Active Encoders</Typography>
                  <Box display="flex" gap={0.5} flexWrap="wrap">
                    {liveMetrics.activeEncoders?.map((encoder: any) => (
                      <Chip
                        key={encoder.id}
                        label={encoder.name}
                        size="small"
                        color={encoder.status === 'healthy' ? 'success' : 'error'}
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Shorts Section */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Box display="flex" alignItems="center">
                  <ShortText sx={{ mr: 1 }} />
                  <Typography variant="h6">Shorts Publishing</Typography>
                </Box>
                <Chip 
                  label={`${shortsMetrics.successRate || 0}% Success`}
                  color={shortsMetrics.successRate >= 95 ? 'success' : 'warning'}
                  size="small"
                />
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography variant="body2" color="textSecondary">In Queue</Typography>
                  <Typography variant="h6">{shortsMetrics.queueCount}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2" color="textSecondary">Processing</Typography>
                  <Typography variant="h6">{shortsMetrics.processingCount}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2" color="textSecondary">Published</Typography>
                  <Typography variant="h6">{shortsMetrics.publishedCount}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2" gutterBottom>Publishing Status</Typography>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Paper variant="outlined" sx={{ p: 1 }}>
                        <Typography variant="caption" color="textSecondary">Avg Duration</Typography>
                        <Box display="flex" alignItems="center" mt={0.5}>
                          <TimerOutlined sx={{ fontSize: 16, mr: 0.5 }} />
                          <Typography variant="body2">{shortsMetrics.avgDuration}s</Typography>
                        </Box>
                      </Paper>
                    </Grid>
                    <Grid item xs={6}>
                      <Paper variant="outlined" sx={{ p: 1 }}>
                        <Typography variant="caption" color="textSecondary">Avg Size</Typography>
                        <Box display="flex" alignItems="center" mt={0.5}>
                          <Storage sx={{ fontSize: 16, mr: 0.5 }} />
                          <Typography variant="body2">{shortsMetrics.avgSize}MB</Typography>
                        </Box>
                      </Paper>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>Distribution</Typography>
                  <Box display="flex" gap={0.5} flexWrap="wrap">
                    {shortsMetrics.platforms?.map((platform: any) => (
                      <Chip
                        key={platform.name}
                        label={`${platform.name} (${platform.count})`}
                        size="small"
                        color={platform.status === 'active' ? 'success' : 'default'}
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Encoding Profiles and Distribution */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Encoding Profiles & Platform Distribution</Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Platform</TableCell>
                      <TableCell>Profile</TableCell>
                      <TableCell>Resolution</TableCell>
                      <TableCell>Bitrate</TableCell>
                      <TableCell>Audio</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Daily Volume</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {metrics.encodingProfiles?.map((profile: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            {getContentIcon(profile.platform)}
                            <Typography sx={{ ml: 1 }}>{profile.platform}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{profile.name}</TableCell>
                        <TableCell>{profile.resolution}</TableCell>
                        <TableCell>{profile.bitrate}</TableCell>
                        <TableCell>{profile.audio}</TableCell>
                        <TableCell>
                          <Chip
                            label={profile.status}
                            color={getStatusColor(profile.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">{profile.dailyVolume}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Content Delivery & DRM Management */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Content Delivery Status */}
        <Grid item xs={12} md={4}>
          <Accordion expanded={expandedSection === 'delivery'} onChange={() => handleExpandSection('delivery')}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box display="flex" alignItems="center">
                <CloudUpload sx={{ mr: 1 }} />
                <Typography variant="h6">Content Delivery Status</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                {deliveryStatus.map((platform) => (
                  <Grid item xs={12} key={platform.name}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Box display="flex" alignItems="center">
                          <Tv sx={{ mr: 1 }} />
                          <Typography variant="body1">{platform.name}</Typography>
                        </Box>
                        {platform.status === 'success' && <CheckCircle color="success" />}
                        {platform.status === 'pending' && <HourglassEmpty color="warning" />}
                        {platform.status === 'failed' && <Error color="error" />}
                      </Box>
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                        {platform.details}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>

        {/* DRM Management */}
        <Grid item xs={12} md={4}>
          <Accordion expanded={expandedSection === 'drm'} onChange={() => handleExpandSection('drm')}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box display="flex" alignItems="center">
                <Security sx={{ mr: 1 }} />
                <Typography variant="h6">DRM Management</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                {drmStatus.map((drm) => (
                  <Grid item xs={12} key={drm.type}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Box display="flex" alignItems="center">
                          <Security sx={{ mr: 1 }} />
                          <Typography variant="body1">{drm.type}</Typography>
                        </Box>
                        {drm.status === 'applied' && <CheckCircle color="success" />}
                        {drm.status === 'pending' && <HourglassEmpty color="warning" />}
                        {drm.status === 'error' && <Error color="error" />}
                      </Box>
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                        {drm.details}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>

        {/* Subtitle/Language Tracking */}
        <Grid item xs={12} md={4}>
          <Accordion expanded={expandedSection === 'subtitles'} onChange={() => handleExpandSection('subtitles')}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box display="flex" alignItems="center">
                <Subtitles sx={{ mr: 1 }} />
                <Typography variant="h6">Subtitle & Language Tracks</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                {subtitleTracks.map((track) => (
                  <Grid item xs={12} key={track.language}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Box display="flex" alignItems="center">
                          <Translate sx={{ mr: 1 }} />
                          <Typography variant="body1">{track.language}</Typography>
                        </Box>
                        {track.status === 'available' && <CheckCircle color="success" />}
                        {track.status === 'missing' && <Error color="error" />}
                      </Box>
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                        {track.details}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>

      {/* Active Processing Queue */}
      <Grid container spacing={3}>
        {metrics.activeQueue?.map((item: any, index: number) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Box display="flex" alignItems="center">
                    {getContentIcon(item.type)}
                    <Box sx={{ ml: 1 }}>
                      <Typography variant="h6">
                        {item.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {item.type} • {item.duration}
                      </Typography>
                    </Box>
                  </Box>
                  <Chip
                    label={item.status}
                    color={getStatusColor(item.status)}
                    size="small"
                  />
                </Box>

                {/* Metadata Status */}
                <Box mb={2}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Metadata Validation
                  </Typography>
                  <Grid container spacing={1}>
                    {Object.entries(item.metadata || {}).map(([key, value]: [string, any]) => (
                      <Grid item xs={6} key={key}>
                        <Chip
                          size="small"
                          label={key}
                          color={value ? 'success' : 'error'}
                          variant="outlined"
                          sx={{ width: '100%' }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                {/* Processing Progress */}
                <Box mb={2}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Processing Pipeline
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <Typography variant="caption" color="textSecondary">
                        Transcoding ({item.transcodingProgress}%)
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={item.transcodingProgress}
                        color="primary"
                        sx={{ height: 6, borderRadius: 3 }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="caption" color="textSecondary">
                        QC ({item.qcProgress}%)
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={item.qcProgress}
                        color="secondary"
                        sx={{ height: 6, borderRadius: 3 }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="caption" color="textSecondary">
                        Package ({item.packageProgress}%)
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={item.packageProgress}
                        color="warning"
                        sx={{ height: 6, borderRadius: 3 }}
                      />
                    </Grid>
                  </Grid>
                </Box>

                {/* Processing Details */}
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Typography variant="body2" color="textSecondary">ETA</Typography>
                    <Typography variant="body1">{item.eta || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="body2" color="textSecondary">Priority</Typography>
                    <Typography variant="body1">{item.priority}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="body2" color="textSecondary">Queue</Typography>
                    <Typography variant="body1">#{item.queuePosition}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PublishingTab;