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
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Alert,
  Button,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { bugsAndFeaturesAPI } from '../../api/bugsAndFeaturesAPI';
import LoadingSpinner from '../Shared/LoadingSpinner';
import { styled } from '@mui/material/styles';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import TabletMacIcon from '@mui/icons-material/TabletMac';
import WebIcon from '@mui/icons-material/Web';
import TvIcon from '@mui/icons-material/Tv';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import ScheduleIcon from '@mui/icons-material/Schedule';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const ProgressChip = styled(Chip)<{ status: 'completed' | 'in-progress' | 'blocked' }>(
  ({ theme, status }) => ({
    backgroundColor:
      status === 'completed'
        ? theme.palette.success.light
        : status === 'blocked'
        ? theme.palette.error.light
        : theme.palette.warning.light,
    color:
      status === 'completed'
        ? theme.palette.success.contrastText
        : status === 'blocked'
        ? theme.palette.error.contrastText
        : theme.palette.warning.contrastText,
  })
);

const PlatformSection: React.FC<{
  platform: string;
  icon: React.ReactNode;
  features: Array<{
    id: string;
    name: string;
    progress: number;
    status: 'completed' | 'in-progress' | 'blocked';
  }>;
}> = ({ platform, icon, features }) => (
  <Paper sx={{ p: 2, mb: 3 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      {icon}
      <Typography variant="h6" sx={{ ml: 1 }}>
        {platform}
      </Typography>
    </Box>
    <List>
      {features.map((feature, index) => (
        <React.Fragment key={feature.id}>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                {feature.status === 'completed' ? (
                  <CheckCircleIcon color="success" />
                ) : feature.status === 'blocked' ? (
                  <ErrorIcon color="error" />
                ) : (
                  <ScheduleIcon color="warning" />
                )}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={feature.name}
              secondary={
                <Box sx={{ mt: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={feature.progress}
                    sx={{ mb: 1 }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="textSecondary">
                      {feature.progress}% Complete
                    </Typography>
                    <ProgressChip
                      label={feature.status}
                      size="small"
                      status={feature.status}
                    />
                  </Box>
                </Box>
              }
            />
          </ListItem>
          {index < features.length - 1 && <Divider variant="inset" component="li" />}
        </React.Fragment>
      ))}
    </List>
  </Paper>
);

export const SprintFeatures: React.FC = () => {
  // Mock data - replace with actual API data
  const mockData = {
    android: [
      {
        id: 'a1',
        name: 'Push Notification Enhancement',
        progress: 75,
        status: 'in-progress' as const,
      },
      {
        id: 'a2',
        name: 'Offline Mode Support',
        progress: 100,
        status: 'completed' as const,
      },
      {
        id: 'a3',
        name: 'Performance Optimization',
        progress: 30,
        status: 'blocked' as const,
      },
    ],
    ios: [
      {
        id: 'i1',
        name: 'Widget Support',
        progress: 90,
        status: 'in-progress' as const,
      },
      {
        id: 'i2',
        name: 'iOS 17 Compatibility',
        progress: 100,
        status: 'completed' as const,
      },
    ],
    web: [
      {
        id: 'w1',
        name: 'Progressive Web App',
        progress: 60,
        status: 'in-progress' as const,
      },
      {
        id: 'w2',
        name: 'Analytics Dashboard',
        progress: 45,
        status: 'blocked' as const,
      },
    ],
    tv: [
      {
        id: 't1',
        name: 'Smart TV App Update',
        progress: 85,
        status: 'in-progress' as const,
      },
      {
        id: 't2',
        name: 'Remote Control Features',
        progress: 100,
        status: 'completed' as const,
      },
    ],
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <PlatformSection
        platform="Android"
        icon={<PhoneAndroidIcon color="primary" />}
        features={mockData.android}
      />
      <PlatformSection
        platform="iOS"
        icon={<TabletMacIcon color="primary" />}
        features={mockData.ios}
      />
      <PlatformSection
        platform="Web"
        icon={<WebIcon color="primary" />}
        features={mockData.web}
      />
      <PlatformSection
        platform="TV"
        icon={<TvIcon color="primary" />}
        features={mockData.tv}
      />
    </Box>
  );
};