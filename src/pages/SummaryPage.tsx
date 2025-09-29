import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Divider,
  Alert,
  Paper,
  Avatar,
} from '@mui/material';
import {
  Dashboard,
  AdminPanelSettings,
  Movie,
  Input,
  Person,
  Analytics,
  Security,
  Publish,
  Assessment,
  TrendingUp,
  Cloud,
  Storage,
  LiveTv,
  ContentPaste,
  BugReport,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const SummaryPage: React.FC = () => {
  const { user, isAdmin, hasInputAccess, hasFullAccess } = useAuth();

  const platformFeatures = [
    {
      title: 'Publishing Module',
      description: 'Comprehensive content publishing for VOD, Live streams, and Shorts',
      icon: <Movie />,
      capabilities: ['VOD Content Management', 'Live Streaming Control', 'Shorts Publishing', 'Content Delivery', 'DRM & Security', 'Subtitle Management', 'Encoding Profiles']
    },
    {
      title: 'Dashboard Analytics',
      description: 'Real-time program and platform reporting with drill-down capabilities',
      icon: <Dashboard />,
      capabilities: ['Program Health Monitoring', 'Platform Analytics', 'Performance Metrics', 'Business Intelligence', 'Custom Reports', 'Executive Summaries']
    },
    {
      title: 'Data Input System',
      description: 'Role-based data input and management system',
      icon: <Input />,
      capabilities: ['Publishing Data Entry', 'Dashboard Metrics Input', 'User Management', 'Settings Configuration', 'Bulk Data Import', 'Data Validation']
    },
    {
      title: 'Role Management',
      description: 'Comprehensive user role and permission system',
      icon: <Person />,
      capabilities: ['Admin Full Access', 'Executive Reporting', 'PM Data Input', 'TPM Tracking', 'EM Analytics', 'SRE Monitoring']
    }
  ];

  const userRoles = [
    {
      role: 'admin',
      name: 'Administrator',
      description: 'Full system access with user management and all data input capabilities',
      permissions: ['Full Access', 'User Management', 'All Data Input', 'System Settings', 'Export Reports'],
      color: 'error' as const
    },
    {
      role: 'executive',
      name: 'Executive',
      description: 'Executive dashboards and high-level reporting access',
      permissions: ['Executive Dashboards', 'Report Export', 'High-level Analytics', 'Read-only Access'],
      color: 'primary' as const
    },
    {
      role: 'pm',
      name: 'Product Manager',
      description: 'Product metrics and feature tracking with limited data input',
      permissions: ['Product Metrics', 'Feature Tracking', 'Limited Data Input', 'Publishing Data'],
      color: 'success' as const
    },
    {
      role: 'tpm',
      name: 'Technical Program Manager',
      description: 'Technical metrics and project tracking capabilities',
      permissions: ['Technical Metrics', 'Project Tracking', 'Limited Data Input', 'Platform Analytics'],
      color: 'info' as const
    },
    {
      role: 'em',
      name: 'Engineering Manager',
      description: 'Engineering metrics and team performance data',
      permissions: ['Engineering Metrics', 'Team Analytics', 'Limited Data Input', 'Performance Tracking'],
      color: 'warning' as const
    },
    {
      role: 'sre',
      name: 'Site Reliability Engineer',
      description: 'System metrics and operational monitoring (read-only)',
      permissions: ['System Metrics', 'Operational Monitoring', 'Read-only Access', 'Alert Management'],
      color: 'secondary' as const
    }
  ];

  const dashboardTabs = [
    { name: 'Program Overview', description: 'Comprehensive program health and status tracking', icon: <Assessment /> },
    { name: 'Sprint Features', description: 'Feature development and sprint progress monitoring', icon: <TrendingUp /> },
    { name: 'Bugs Analytics', description: 'Bug tracking, resolution trends, and quality metrics', icon: <BugReport /> },
    { name: 'Backend Services', description: 'Backend service health and performance monitoring', icon: <Storage /> },
    { name: 'Platform Analytics', description: 'Multi-platform performance and user analytics', icon: <Analytics /> },
    { name: 'Content Publishing', description: 'VOD, Live, and Shorts publishing metrics and status', icon: <Publish /> },
    { name: 'CMS Metrics', description: 'Content management system performance and usage', icon: <ContentPaste /> },
    { name: 'Ops & CDN', description: 'Operations and content delivery network monitoring', icon: <Cloud /> }
  ];

  return (
    <Box>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Livpulse Platform Summary
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          OTT Publishing & Program Management Platform
        </Typography>
        
        {/* User Status */}
        <Paper sx={{ p: 2, mt: 2, bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.200' }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                {user?.name?.charAt(0) || 'U'}
              </Avatar>
            </Grid>
            <Grid item xs>
              <Typography variant="h6">{user?.name}</Typography>
              <Typography variant="body2" color="text.secondary">{user?.email}</Typography>
            </Grid>
            <Grid item>
              <Chip 
                label={userRoles.find(r => r.role === user?.role)?.name || user?.role?.toUpperCase()} 
                color={userRoles.find(r => r.role === user?.role)?.color || 'default'}
              />
            </Grid>
            <Grid item>
              <Box display="flex" gap={1}>
                {hasFullAccess && <Chip label="Full Access" color="error" size="small" />}
                {hasInputAccess && !hasFullAccess && <Chip label="Input Access" color="warning" size="small" />}
                {!hasInputAccess && <Chip label="Read Only" color="default" size="small" />}
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      <Grid container spacing={3}>
        {/* Platform Overview */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Dashboard color="primary" />
                Platform Overview
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Livpulse is a comprehensive OTT publishing and program management platform designed for enterprise-scale 
                content operations. It provides real-time analytics, role-based access control, and streamlined content 
                publishing workflows for VOD, Live streaming, and Shorts content.
              </Typography>
              
              <Grid container spacing={3} mt={2}>
                {platformFeatures.map((feature, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                      <CardContent>
                        <Box display="flex" alignItems="center" gap={1} mb={2}>
                          {feature.icon}
                          <Typography variant="h6">{feature.title}</Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {feature.description}
                        </Typography>
                        <Box>
                          <Typography variant="subtitle2" gutterBottom>Key Capabilities:</Typography>
                          <Box display="flex" flexWrap="wrap" gap={0.5}>
                            {feature.capabilities.map((capability, idx) => (
                              <Chip key={idx} label={capability} size="small" variant="outlined" />
                            ))}
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Dashboard Structure */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Analytics color="success" />
                Dashboard Structure
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                The dashboard provides comprehensive insights across 8 key areas of OTT operations and program management.
              </Typography>
              
              <List>
                {dashboardTabs.map((tab, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemIcon>
                        {tab.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={tab.name}
                        secondary={tab.description}
                      />
                    </ListItem>
                    {index < dashboardTabs.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Role System */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Security color="warning" />
                Role System
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Six distinct roles with granular permissions for secure, role-based access control.
              </Typography>
              
              <Box>
                {userRoles.map((roleInfo, index) => (
                  <Card 
                    key={index} 
                    variant="outlined" 
                    sx={{ 
                      mb: 2, 
                      bgcolor: user?.role === roleInfo.role ? `${roleInfo.color}.50` : 'background.paper',
                      border: user?.role === roleInfo.role ? `2px solid` : '1px solid',
                      borderColor: user?.role === roleInfo.role ? `${roleInfo.color}.main` : 'divider'
                    }}
                  >
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <Chip 
                          label={roleInfo.name} 
                          color={roleInfo.color} 
                          size="small"
                          variant={user?.role === roleInfo.role ? 'filled' : 'outlined'}
                        />
                        {user?.role === roleInfo.role && (
                          <Chip label="Your Role" color="success" size="small" />
                        )}
                      </Box>
                      <Typography variant="body2" color="text.secondary" fontSize="0.8rem">
                        {roleInfo.description}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Data Input System */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Input color="info" />
                Data Input System
              </Typography>
              
              {hasInputAccess ? (
                <Alert severity="success" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    <strong>Access Granted:</strong> You have permission to input and manage data in the system. 
                    {hasFullAccess ? ' You have full administrative access to all modules.' : ' Your access is limited to relevant sections based on your role.'}
                  </Typography>
                </Alert>
              ) : (
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    <strong>Read-Only Access:</strong> Your current role provides read-only access to dashboards and reports. 
                    Contact your administrator for data input permissions.
                  </Typography>
                </Alert>
              )}

              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography variant="h6" gutterBottom>Publishing Data Input</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Manage VOD, Live streaming, and Shorts content metrics including delivery status, 
                    DRM protection, subtitles, and encoding profiles.
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="h6" gutterBottom>Dashboard Metrics Input</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Input system health, performance metrics, business KPIs, and other dashboard 
                    data points for comprehensive reporting.
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="h6" gutterBottom>Administrative Functions</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {hasFullAccess ? (
                      'User management, role assignment, system settings, and platform configuration.'
                    ) : (
                      'Limited to role-specific administrative functions based on your permissions.'
                    )}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        {hasInputAccess && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AdminPanelSettings color="primary" />
                  Quick Actions
                </Typography>
                <Grid container spacing={2}>
                  <Grid item>
                    <Chip 
                      label="Go to Admin Panel" 
                      color="primary" 
                      clickable 
                      onClick={() => window.location.href = '/admin'}
                    />
                  </Grid>
                  <Grid item>
                    <Chip 
                      label="Publishing Dashboard" 
                      color="success" 
                      clickable 
                      onClick={() => window.location.href = '/dashboard'}
                    />
                  </Grid>
                  <Grid item>
                    <Chip 
                      label="Export Reports" 
                      color="info" 
                      clickable 
                      onClick={() => window.location.href = '/reports'}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default SummaryPage;