import React from 'react';
import { Box, Grid, Typography, CircularProgress, Paper, Chip } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import {
  Timeline, TimelineItem, TimelineSeparator, TimelineConnector,
  TimelineContent, TimelineDot, TimelineOppositeContent
} from '@mui/lab';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell,
  LineChart, Line
} from 'recharts';
import ChartContainer from '../Shared/ChartContainer';
import MetricCard from '../Shared/MetricCard';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

interface Milestone {
  id: string;
  title: string;
  date: string;
  status: 'completed' | 'inProgress' | 'upcoming';
  description: string;
}

interface Resource {
  role: string;
  allocated: number;
  utilized: number;
}

interface Risk {
  category: string;
  probability: number;
  impact: number;
  status: 'mitigated' | 'active' | 'monitoring';
}

interface ProgramData {
  name: string;
  startDate: string;
  endDate: string;
  completion: number;
  budget: {
    allocated: number;
    spent: number;
    forecast: number;
  };
  milestones: Milestone[];
  resources: Resource[];
  risks: Risk[];
  healthMetrics: {
    scope: number;
    schedule: number;
    quality: number;
    team: number;
  };
}

const ProgramDetailsTab: React.FC = () => {
  const { data: programData, isLoading } = useQuery<ProgramData>({
    queryKey: ['programDetails'],
    queryFn: async () => {
      // TODO: Replace with actual API call
      return {
        name: "Platform Modernization",
        startDate: "2025-01-01",
        endDate: "2025-12-31",
        completion: 65,
        budget: {
          allocated: 1000000,
          spent: 580000,
          forecast: 950000
        },
        milestones: [
          { id: '1', title: 'Project Kickoff', date: '2025-01-15', status: 'completed', description: 'Initial planning and team onboarding' },
          { id: '2', title: 'Phase 1 Launch', date: '2025-04-01', status: 'completed', description: 'Core infrastructure upgrade' },
          { id: '3', title: 'Beta Release', date: '2025-09-30', status: 'inProgress', description: 'User testing and feedback' },
          { id: '4', title: 'Final Deployment', date: '2025-12-15', status: 'upcoming', description: 'Production deployment' }
        ],
        resources: [
          { role: 'Developer', allocated: 12, utilized: 10 },
          { role: 'QA', allocated: 6, utilized: 5 },
          { role: 'DevOps', allocated: 4, utilized: 4 },
          { role: 'Designer', allocated: 3, utilized: 2 }
        ],
        risks: [
          { category: 'Technical', probability: 0.3, impact: 0.8, status: 'monitoring' },
          { category: 'Schedule', probability: 0.5, impact: 0.6, status: 'active' },
          { category: 'Resource', probability: 0.2, impact: 0.4, status: 'mitigated' }
        ],
        healthMetrics: {
          scope: 85,
          schedule: 75,
          quality: 90,
          team: 88
        }
      };
    }
  });

  if (isLoading) {
    return <CircularProgress />;
  }

  const resourceData = programData?.resources.map(r => ({
    name: r.role,
    allocated: r.allocated,
    utilized: r.utilized
  }));

  const riskData = programData?.risks.map(r => ({
    name: r.category,
    value: r.probability * r.impact * 100,
    status: r.status
  }));

  const healthData = Object.entries(programData?.healthMetrics || {}).map(([metric, value]) => ({
    name: metric,
    value
  }));

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Program Details: {programData?.name}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <MetricCard
            title="Overall Progress"
            value={`${programData?.completion}%`}
            trend={{
              direction: "up",
              value: 5,
              label: "On track"
            }}
            status="healthy"
            subtitle="Program completion"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <MetricCard
            title="Budget Utilization"
            value={`${Math.round((programData?.budget.spent || 0) / (programData?.budget.allocated || 1) * 100)}%`}
            trend={{
              direction: "flat",
              value: 0,
              label: "Within budget"
            }}
            status="healthy"
            subtitle="Budget spent"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <MetricCard
            title="Active Risks"
            value={programData?.risks.filter(r => r.status === 'active').length || 0}
            trend={{
              direction: "down",
              value: 2,
              label: "Reduced from last month"
            }}
            status="warning"
            subtitle="Needs attention"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <MetricCard
            title="Resource Utilization"
            value={`${Math.round(programData?.resources.reduce((acc, r) => acc + r.utilized, 0) || 0)}/${
              Math.round(programData?.resources.reduce((acc, r) => acc + r.allocated, 0) || 0)
            }`}
            trend={{
              direction: "up",
              value: 3,
              label: "Team members"
            }}
            status="healthy"
            subtitle="Active resources"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <ChartContainer title="Resource Allocation" subtitle="Team distribution and utilization">
            <BarChart width={500} height={300} data={resourceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="allocated" fill="#8884d8" name="Allocated" />
              <Bar dataKey="utilized" fill="#82ca9d" name="Utilized" />
            </BarChart>
          </ChartContainer>
        </Grid>

        <Grid item xs={12} md={6}>
          <ChartContainer title="Risk Analysis" subtitle="Risk severity by category">
            <PieChart width={500} height={300}>
              <Pie
                data={riskData}
                cx={250}
                cy={150}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {riskData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ChartContainer>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Program Timeline
            </Typography>
            <Timeline position="alternate">
              {programData?.milestones.map((milestone) => (
                <TimelineItem key={milestone.id}>
                  <TimelineOppositeContent sx={{ color: 'text.secondary' }}>
                    {milestone.date}
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot color={
                      milestone.status === 'completed' ? 'success' :
                      milestone.status === 'inProgress' ? 'primary' : 'grey'
                    } />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography variant="h6" component="span">
                      {milestone.title}
                    </Typography>
                    <Typography>{milestone.description}</Typography>
                    <Chip
                      size="small"
                      label={milestone.status}
                      color={
                        milestone.status === 'completed' ? 'success' :
                        milestone.status === 'inProgress' ? 'primary' : 'default'
                      }
                      sx={{ mt: 1 }}
                    />
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <ChartContainer title="Program Health Metrics" subtitle="Key performance indicators">
            <LineChart width={1100} height={300} data={healthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#8884d8" name="Health Score" />
            </LineChart>
          </ChartContainer>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProgramDetailsTab;