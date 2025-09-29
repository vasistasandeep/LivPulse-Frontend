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
  Tooltip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import BugReportIcon from '@mui/icons-material/BugReport';
import TimerIcon from '@mui/icons-material/Timer';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  '& .MuiCardContent-root': {
    flexGrow: 1,
  },
}));

const PriorityChip = styled(Chip)<{ priority: 'high' | 'medium' | 'low' }>(
  ({ theme, priority }) => ({
    backgroundColor:
      priority === 'high'
        ? theme.palette.error.light
        : priority === 'medium'
        ? theme.palette.warning.light
        : theme.palette.success.light,
    color:
      priority === 'high'
        ? theme.palette.error.contrastText
        : priority === 'medium'
        ? theme.palette.warning.contrastText
        : theme.palette.success.contrastText,
  })
);

const AgingIndicator = styled(Box)<{ days: number }>(({ theme, days }) => ({
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor:
    days > 30
      ? theme.palette.error.light
      : days > 14
      ? theme.palette.warning.light
      : theme.palette.success.light,
  color:
    days > 30
      ? theme.palette.error.contrastText
      : days > 14
      ? theme.palette.warning.contrastText
      : theme.palette.success.contrastText,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

export const BugsOverview: React.FC = () => {
  // This would come from your API
  const mockData = {
    totalBugs: 125,
    resolvedBugs: 85,
    criticalBugs: 15,
    averageAge: 12,
    bugsByPriority: {
      high: 25,
      medium: 45,
      low: 55,
    },
    bugsByPlatform: {
      Android: 35,
      iOS: 30,
      Web: 40,
      TV: 20,
    },
    agingBuckets: {
      '0-7 days': 45,
      '8-14 days': 35,
      '15-30 days': 30,
      '30+ days': 15,
    },
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <StyledCard>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Bugs
              </Typography>
              <Typography variant="h4">{mockData.totalBugs}</Typography>
              <LinearProgress
                variant="determinate"
                value={(mockData.resolvedBugs / mockData.totalBugs) * 100}
                sx={{ mt: 2 }}
              />
              <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                {mockData.resolvedBugs} resolved
              </Typography>
            </CardContent>
          </StyledCard>
        </Grid>

        <Grid item xs={12} md={3}>
          <StyledCard>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Critical Bugs
              </Typography>
              <Typography variant="h4">{mockData.criticalBugs}</Typography>
              <Box sx={{ mt: 2 }}>
                <PriorityChip
                  priority="high"
                  icon={<PriorityHighIcon />}
                  label="High Priority"
                  size="small"
                />
              </Box>
            </CardContent>
          </StyledCard>
        </Grid>

        <Grid item xs={12} md={3}>
          <StyledCard>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Average Age
              </Typography>
              <Typography variant="h4">{mockData.averageAge} days</Typography>
              <AgingIndicator days={mockData.averageAge}>
                <TimerIcon fontSize="small" />
                <Typography variant="body2">Aging Indicator</Typography>
              </AgingIndicator>
            </CardContent>
          </StyledCard>
        </Grid>

        <Grid item xs={12} md={3}>
          <StyledCard>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Platform Distribution
              </Typography>
              <Box sx={{ mt: 2 }}>
                {Object.entries(mockData.bugsByPlatform).map(([platform, count]) => (
                  <Tooltip key={platform} title={`${count} bugs`}>
                    <Chip
                      label={`${platform}: ${count}`}
                      size="small"
                      sx={{ m: 0.5 }}
                    />
                  </Tooltip>
                ))}
              </Box>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>

      {/* Aging Analysis */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Bug Aging Analysis
        </Typography>
        <Grid container spacing={2}>
          {Object.entries(mockData.agingBuckets).map(([range, count]) => (
            <Grid item xs={12} sm={6} md={3} key={range}>
              <Box
                sx={{
                  p: 2,
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                }}
              >
                <Typography variant="subtitle2" color="textSecondary">
                  {range}
                </Typography>
                <Typography variant="h4">{count}</Typography>
                <LinearProgress
                  variant="determinate"
                  value={(count / mockData.totalBugs) * 100}
                  sx={{ mt: 1 }}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};