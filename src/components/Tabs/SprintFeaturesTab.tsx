import React from 'react';
import { Box, Grid, Typography, CircularProgress, Paper, Tabs, Tab } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import ChartContainer from '../Shared/ChartContainer';
import MetricCard from '../Shared/MetricCard';

interface SprintFeature {
  id: string;
  title: string;
  platform: 'Android' | 'iOS' | 'Web' | 'SmartTV' | 'FireTV';
  status: 'todo' | 'inProgress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  storyPoints: number;
  completionPercentage: number;
}

interface SprintData {
  sprintNumber: number;
  startDate: string;
  endDate: string;
  features: SprintFeature[];
  velocity: {
    planned: number;
    completed: number;
  };
  platformHealth: {
    Android: number;
    iOS: number;
    Web: number;
    SmartTV: number;
    FireTV: number;
  };
}

const SprintFeaturesTab: React.FC = () => {
  const [platform, setPlatform] = React.useState('all');
  const { data: sprintData, isLoading } = useQuery<SprintData>({
    queryKey: ['sprintFeatures'],
    queryFn: async () => {
      // TODO: Replace with actual API call
      return {
        sprintNumber: 24,
        startDate: '2025-09-14',
        endDate: '2025-09-28',
        features: [
          { id: '1', title: 'Player Enhancement', platform: 'Android', status: 'done', priority: 'high', storyPoints: 8, completionPercentage: 100 },
          { id: '2', title: 'Analytics Dashboard', platform: 'Web', status: 'inProgress', priority: 'medium', storyPoints: 5, completionPercentage: 60 },
          { id: '3', title: 'Offline Mode', platform: 'iOS', status: 'review', priority: 'high', storyPoints: 13, completionPercentage: 90 },
          { id: '4', title: 'Smart UI', platform: 'SmartTV', status: 'todo', priority: 'low', storyPoints: 3, completionPercentage: 0 },
          { id: '5', title: 'Voice Control', platform: 'FireTV', status: 'inProgress', priority: 'medium', storyPoints: 8, completionPercentage: 40 }
        ],
        velocity: {
          planned: 45,
          completed: 35
        },
        platformHealth: {
          Android: 92,
          iOS: 88,
          Web: 95,
          SmartTV: 85,
          FireTV: 90
        }
      };
    }
  });

  if (isLoading) {
    return <CircularProgress />;
  }

  const platformPerformance = Object.entries(sprintData?.platformHealth || {}).map(([platform, score]) => ({
    platform,
    score
  }));

  const featuresByStatus = ['todo', 'inProgress', 'review', 'done'].map(status => ({
    name: status,
    count: sprintData?.features.filter(f => f.status === status).length || 0
  }));

  const handlePlatformChange = (_: React.SyntheticEvent, newValue: string) => {
    setPlatform(newValue);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Sprint Features Dashboard
      </Typography>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={platform}
          onChange={handlePlatformChange}
          textColor="primary"
          indicatorColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab value="all" label="All Platforms" />
          <Tab value="Android" label="Android" />
          <Tab value="iOS" label="iOS" />
          <Tab value="Web" label="Web" />
          <Tab value="SmartTV" label="Smart TV" />
          <Tab value="FireTV" label="Fire TV" />
        </Tabs>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <MetricCard
            title="Sprint Progress"
            value={`${Math.round((sprintData?.velocity.completed || 0) / (sprintData?.velocity.planned || 1) * 100)}%`}
            trend={{
              direction: "up",
              value: 8,
              label: "Above average velocity"
            }}
            status="healthy"
            subtitle={`Sprint ${sprintData?.sprintNumber}`}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <MetricCard
            title="Story Points"
            value={sprintData?.velocity.completed || 0}
            trend={{
              direction: "up",
              value: 5,
              label: `of ${sprintData?.velocity.planned} planned`
            }}
            status="healthy"
            subtitle="Points completed"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <MetricCard
            title="Features in Review"
            value={sprintData?.features.filter(f => f.status === 'review').length || 0}
            trend={{
              direction: "flat",
              value: 0,
              label: "Awaiting review"
            }}
            status="warning"
            subtitle="Pending reviews"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <MetricCard
            title="Completion Rate"
            value={`${Math.round((sprintData?.features.filter(f => f.status === 'done').length || 0) / (sprintData?.features.length || 1) * 100)}%`}
            trend={{
              direction: "up",
              value: 12,
              label: "Feature completion"
            }}
            status="healthy"
            subtitle="Features completed"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <ChartContainer title="Platform Health" subtitle="Current sprint performance by platform">
            <RadarChart width={500} height={300} data={platformPerformance}>
              <PolarGrid />
              <PolarAngleAxis dataKey="platform" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar name="Health Score" dataKey="score" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              <Legend />
            </RadarChart>
          </ChartContainer>
        </Grid>

        <Grid item xs={12} md={6}>
          <ChartContainer title="Feature Status" subtitle="Distribution of features by status">
            <BarChart width={500} height={300} data={featuresByStatus}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ChartContainer>
        </Grid>

        <Grid item xs={12}>
          <ChartContainer title="Sprint Timeline" subtitle="Feature completion over time">
            <LineChart width={1100} height={300} data={sprintData?.features}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="title" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="completionPercentage" stroke="#8884d8" name="Completion %" />
            </LineChart>
          </ChartContainer>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SprintFeaturesTab;