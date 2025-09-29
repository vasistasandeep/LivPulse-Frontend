import React from 'react';
import {
  Box,
  Paper,
  Grid,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import ChartContainer from '../Shared/ChartContainer';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const MetricChip = styled(Chip)<{ trend: 'up' | 'down' }>(({ theme, trend }) => ({
  backgroundColor:
    trend === 'up' ? theme.palette.success.light : theme.palette.error.light,
  color:
    trend === 'up'
      ? theme.palette.success.contrastText
      : theme.palette.error.contrastText,
}));

export const ProgramDetails: React.FC = () => {
  // Mock data - replace with actual API data
  const mockData = {
    programHealth: {
      overall: 85,
      stability: 90,
      performance: 82,
      userSatisfaction: 88,
    },
    metrics: {
      userBase: {
        value: '2.5M',
        growth: 15,
        trend: 'up' as const,
      },
      retention: {
        value: '78%',
        growth: -2,
        trend: 'down' as const,
      },
      engagement: {
        value: '45min',
        growth: 8,
        trend: 'up' as const,
      },
      revenue: {
        value: '$1.2M',
        growth: 12,
        trend: 'up' as const,
      },
    },
    platformPerformance: [
      {
        name: 'Android',
        crashes: 12,
        performance: 88,
        satisfaction: 85,
      },
      {
        name: 'iOS',
        crashes: 8,
        performance: 92,
        satisfaction: 90,
      },
      {
        name: 'Web',
        crashes: 5,
        performance: 95,
        satisfaction: 88,
      },
      {
        name: 'TV',
        crashes: 10,
        performance: 87,
        satisfaction: 82,
      },
    ],
    recentUpdates: [
      {
        id: 1,
        platform: 'Android',
        version: '2.5.0',
        date: '2025-09-25',
        status: 'success',
      },
      {
        id: 2,
        platform: 'iOS',
        version: '2.4.8',
        date: '2025-09-20',
        status: 'success',
      },
      {
        id: 3,
        platform: 'Web',
        version: '1.9.2',
        date: '2025-09-18',
        status: 'warning',
      },
    ],
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Program Health Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {Object.entries(mockData.metrics).map(([key, data]) => (
          <Grid item xs={12} sm={6} md={3} key={key}>
            <StyledCard>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </Typography>
                <Typography variant="h4">{data.value}</Typography>
                <Box sx={{ mt: 2 }}>
                  <MetricChip
                    trend={data.trend}
                    icon={
                      data.trend === 'up' ? (
                        <TrendingUpIcon />
                      ) : (
                        <TrendingDownIcon />
                      )
                    }
                    label={`${data.growth}%`}
                  />
                </Box>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>

      {/* Platform Performance Chart */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Platform Performance
        </Typography>
        <Box sx={{ height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockData.platformPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="performance"
                name="Performance Score"
                fill="#2196f3"
              />
              <Bar
                dataKey="satisfaction"
                name="User Satisfaction"
                fill="#4caf50"
              />
              <Bar dataKey="crashes" name="Crash Rate" fill="#f44336" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Paper>

      {/* Recent Updates */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Recent Updates
        </Typography>
        <List>
          {mockData.recentUpdates.map((update, index) => (
            <React.Fragment key={update.id}>
              <ListItem>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1">
                        {update.platform} v{update.version}
                      </Typography>
                      <Chip
                        size="small"
                        label={update.status}
                        color={update.status === 'success' ? 'success' : 'warning'}
                      />
                    </Box>
                  }
                  secondary={`Released on ${update.date}`}
                />
              </ListItem>
              {index < mockData.recentUpdates.length - 1 && (
                <Divider component="li" />
              )}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Box>
  );
};