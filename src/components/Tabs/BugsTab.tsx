import React from 'react';
import { Box, Grid, Typography, CircularProgress } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell,
  LineChart, Line,
} from 'recharts';
import ChartContainer from '../Shared/ChartContainer';
import MetricCard from '../Shared/MetricCard';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

interface BugData {
  aging: {
    '0-7days': number;
    '8-15days': number;
    '16-30days': number;
    '30+days': number;
  };
  priority: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  status: {
    open: number;
    inProgress: number;
    blocked: number;
    resolved: number;
    closed: number;
  };
  trend: Array<{
    date: string;
    count: number;
  }>;
}

const BugsTab: React.FC = () => {
  const { data: bugData, isLoading } = useQuery<BugData>({
    queryKey: ['bugAnalytics'],
    queryFn: async () => {
      // TODO: Replace with actual API call
      return {
        aging: {
          '0-7days': 15,
          '8-15days': 10,
          '16-30days': 5,
          '30+days': 3
        },
        priority: {
          critical: 8,
          high: 12,
          medium: 20,
          low: 15
        },
        status: {
          open: 20,
          inProgress: 15,
          blocked: 5,
          resolved: 8,
          closed: 30
        },
        trend: [
          { date: '2025-09-21', count: 45 },
          { date: '2025-09-22', count: 42 },
          { date: '2025-09-23', count: 48 },
          { date: '2025-09-24', count: 40 },
          { date: '2025-09-25', count: 35 },
          { date: '2025-09-26', count: 38 },
          { date: '2025-09-27', count: 33 }
        ]
      };
    }
  });

  if (isLoading) {
    return <CircularProgress />;
  }

  const agingData = bugData && Object.entries(bugData.aging).map(([range, value]) => ({
    name: range,
    value
  }));

  const priorityData = bugData && Object.entries(bugData.priority).map(([priority, count]) => ({
    name: priority,
    count
  }));

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Bug Analytics
      </Typography>
      
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={3}>
          <MetricCard
            title="Total Open Bugs"
            value={bugData?.status.open || 0}
            trend={{
              direction: "down",
              value: 12,
              label: "Compared to last week"
            }}
            status={(bugData?.status.open || 0) > 30 ? 'critical' : (bugData?.status.open || 0) > 20 ? 'warning' : 'healthy'}
            subtitle="Current open issues"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <MetricCard
            title="Critical Bugs"
            value={bugData?.priority.critical || 0}
            trend={{
              direction: "up",
              value: 2,
              label: "New critical bugs this week"
            }}
            status="critical"
            subtitle="High priority issues"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <MetricCard
            title="Avg Resolution Time"
            value="3.2 days"
            trend={{
              direction: "down",
              value: 15,
              label: "Faster resolution time"
            }}
            status="healthy"
            subtitle="Time to resolve"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <MetricCard
            title="Bug Fix Rate"
            value="85%"
            trend={{
              direction: "up",
              value: 5,
              label: "Weekly fix rate"
            }}
            status="healthy"
            subtitle="Resolution rate"
          />
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={6}>
          <ChartContainer title="Bug Aging Analysis">
            <BarChart width={500} height={300} data={agingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ChartContainer>
        </Grid>

        <Grid item xs={12} md={6}>
          <ChartContainer title="Priority Distribution">
            <PieChart width={500} height={300}>
              <Pie
                data={priorityData}
                cx={250}
                cy={150}
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
                label
              >
                {priorityData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ChartContainer>
        </Grid>

        <Grid item xs={12}>
          <ChartContainer title="Bug Trend (Last 7 Days)">
            <LineChart width={1100} height={300} data={bugData?.trend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#8884d8" />
            </LineChart>
          </ChartContainer>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BugsTab;