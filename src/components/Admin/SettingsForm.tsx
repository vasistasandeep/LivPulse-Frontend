import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  Alert,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
} from '@mui/material';
import {
  Save,
  Refresh,
  Settings,
  ExpandMore,
  Palette,
  Notifications,
  Security,
  Analytics,
  Cloud,
} from '@mui/icons-material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { dashboardAPI } from '../../api/dashboardAPI';

interface AppSettings {
  general: {
    appName: string;
    version: string;
    environment: 'development' | 'staging' | 'production';
    maintenanceMode: boolean;
    debugMode: boolean;
  };
  ui: {
    theme: 'light' | 'dark' | 'auto';
    primaryColor: string;
    compactMode: boolean;
    showTooltips: boolean;
    autoRefreshInterval: number;
  };
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    alertThreshold: number;
    quietHours: {
      enabled: boolean;
      startTime: string;
      endTime: string;
    };
  };
  security: {
    sessionTimeout: number;
    maxLoginAttempts: number;
    requireTwoFactor: boolean;
    passwordPolicy: {
      minLength: number;
      requireUppercase: boolean;
      requireNumbers: boolean;
      requireSymbols: boolean;
    };
  };
  analytics: {
    trackingEnabled: boolean;
    dataRetentionDays: number;
    anonymizeData: boolean;
    exportFormat: 'json' | 'csv' | 'excel';
  };
  integrations: {
    railwayApiKey: string;
    slackWebhookUrl: string;
    emailProvider: 'sendgrid' | 'mailgun' | 'ses';
    enableWebhooks: boolean;
  };
}

const SettingsForm: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>({
    general: {
      appName: 'Livpulse',
      version: '1.0.0',
      environment: 'production',
      maintenanceMode: false,
      debugMode: false,
    },
    ui: {
      theme: 'light',
      primaryColor: '#1976d2',
      compactMode: false,
      showTooltips: true,
      autoRefreshInterval: 30,
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      alertThreshold: 85,
      quietHours: {
        enabled: false,
        startTime: '22:00',
        endTime: '08:00',
      },
    },
    security: {
      sessionTimeout: 60,
      maxLoginAttempts: 3,
      requireTwoFactor: false,
      passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireNumbers: true,
        requireSymbols: false,
      },
    },
    analytics: {
      trackingEnabled: true,
      dataRetentionDays: 90,
      anonymizeData: true,
      exportFormat: 'json',
    },
    integrations: {
      railwayApiKey: '',
      slackWebhookUrl: '',
      emailProvider: 'sendgrid',
      enableWebhooks: true,
    },
  });

  const queryClient = useQueryClient();

  // Fetch current settings
  const { data: currentSettings, isLoading, error } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: () => dashboardAPI.getSettings(),
  });

  // Save settings
  const saveSettingsMutation = useMutation({
    mutationFn: (settingsData: AppSettings) => dashboardAPI.updateSettings(settingsData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
    },
  });

  const handleSave = () => {
    saveSettingsMutation.mutate(settings);
  };

  const handleRefresh = () => {
    if (currentSettings?.data?.data) {
      setSettings(currentSettings.data.data);
    }
  };

  const updateSetting = (section: keyof AppSettings, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const updateNestedSetting = (section: keyof AppSettings, nestedSection: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [nestedSection]: {
          ...(prev[section] as any)[nestedSection],
          [field]: value
        }
      }
    }));
  };

  React.useEffect(() => {
    if (currentSettings?.data?.data) {
      setSettings(currentSettings.data.data);
    }
  }, [currentSettings]);

  const settingsSections = [
    {
      key: 'general',
      title: 'General Settings',
      icon: <Settings />,
      description: 'Application name, version, and environment settings'
    },
    {
      key: 'ui',
      title: 'User Interface',
      icon: <Palette />,
      description: 'Theme, colors, and display preferences'
    },
    {
      key: 'notifications',
      title: 'Notifications',
      icon: <Notifications />,
      description: 'Alert settings and notification preferences'
    },
    {
      key: 'security',
      title: 'Security',
      icon: <Security />,
      description: 'Authentication and security policies'
    },
    {
      key: 'analytics',
      title: 'Analytics',
      icon: <Analytics />,
      description: 'Data tracking and reporting settings'
    },
    {
      key: 'integrations',
      title: 'Integrations',
      icon: <Cloud />,
      description: 'External service integrations and API keys'
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            Application Settings
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Configure application behavior, integrations, and security settings
          </Typography>
        </Box>
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={handleRefresh}
            disabled={isLoading}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSave}
            disabled={saveSettingsMutation.isPending}
          >
            Save Settings
          </Button>
        </Box>
      </Box>

      {/* Status Messages */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load settings: {error.message}
        </Alert>
      )}

      {saveSettingsMutation.isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to save settings: {saveSettingsMutation.error.message}
        </Alert>
      )}

      {saveSettingsMutation.isSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Settings saved successfully! Some changes may require a page refresh.
        </Alert>
      )}

      {/* Settings Sections */}
      <Box>
        {/* General Settings */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box display="flex" alignItems="center" gap={1}>
              <Settings color="primary" />
              <Typography variant="h6">General Settings</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Application Name"
                  value={settings.general.appName}
                  onChange={(e) => updateSetting('general', 'appName', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Environment</InputLabel>
                  <Select
                    value={settings.general.environment}
                    onChange={(e) => updateSetting('general', 'environment', e.target.value)}
                  >
                    <MenuItem value="development">Development</MenuItem>
                    <MenuItem value="staging">Staging</MenuItem>
                    <MenuItem value="production">Production</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.general.maintenanceMode}
                      onChange={(e) => updateSetting('general', 'maintenanceMode', e.target.checked)}
                    />
                  }
                  label="Maintenance Mode"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.general.debugMode}
                      onChange={(e) => updateSetting('general', 'debugMode', e.target.checked)}
                    />
                  }
                  label="Debug Mode"
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* UI Settings */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box display="flex" alignItems="center" gap={1}>
              <Palette color="secondary" />
              <Typography variant="h6">User Interface</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Theme</InputLabel>
                  <Select
                    value={settings.ui.theme}
                    onChange={(e) => updateSetting('ui', 'theme', e.target.value)}
                  >
                    <MenuItem value="light">Light</MenuItem>
                    <MenuItem value="dark">Dark</MenuItem>
                    <MenuItem value="auto">Auto</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Auto Refresh Interval (seconds)"
                  value={settings.ui.autoRefreshInterval}
                  onChange={(e) => updateSetting('ui', 'autoRefreshInterval', parseInt(e.target.value))}
                  inputProps={{ min: 10, max: 300 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.ui.compactMode}
                      onChange={(e) => updateSetting('ui', 'compactMode', e.target.checked)}
                    />
                  }
                  label="Compact Mode"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.ui.showTooltips}
                      onChange={(e) => updateSetting('ui', 'showTooltips', e.target.checked)}
                    />
                  }
                  label="Show Tooltips"
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Security Settings */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box display="flex" alignItems="center" gap={1}>
              <Security color="warning" />
              <Typography variant="h6">Security</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Session Timeout (minutes)"
                  value={settings.security.sessionTimeout}
                  onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                  inputProps={{ min: 5, max: 480 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Max Login Attempts"
                  value={settings.security.maxLoginAttempts}
                  onChange={(e) => updateSetting('security', 'maxLoginAttempts', parseInt(e.target.value))}
                  inputProps={{ min: 1, max: 10 }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.security.requireTwoFactor}
                      onChange={(e) => updateSetting('security', 'requireTwoFactor', e.target.checked)}
                    />
                  }
                  label="Require Two-Factor Authentication"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>Password Policy</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Min Length"
                      value={settings.security.passwordPolicy.minLength}
                      onChange={(e) => updateNestedSetting('security', 'passwordPolicy', 'minLength', parseInt(e.target.value))}
                      inputProps={{ min: 4, max: 32 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.security.passwordPolicy.requireUppercase}
                          onChange={(e) => updateNestedSetting('security', 'passwordPolicy', 'requireUppercase', e.target.checked)}
                        />
                      }
                      label="Uppercase"
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.security.passwordPolicy.requireNumbers}
                          onChange={(e) => updateNestedSetting('security', 'passwordPolicy', 'requireNumbers', e.target.checked)}
                        />
                      }
                      label="Numbers"
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.security.passwordPolicy.requireSymbols}
                          onChange={(e) => updateNestedSetting('security', 'passwordPolicy', 'requireSymbols', e.target.checked)}
                        />
                      }
                      label="Symbols"
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Box>

      {/* Current Configuration Summary */}
      <Box mt={3}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Configuration Summary</Typography>
            <Grid container spacing={2}>
              <Grid item>
                <Chip label={`Environment: ${settings.general.environment}`} color="primary" />
              </Grid>
              <Grid item>
                <Chip label={`Theme: ${settings.ui.theme}`} color="secondary" />
              </Grid>
              <Grid item>
                <Chip 
                  label={settings.general.maintenanceMode ? 'Maintenance ON' : 'Maintenance OFF'} 
                  color={settings.general.maintenanceMode ? 'warning' : 'success'} 
                />
              </Grid>
              <Grid item>
                <Chip 
                  label={settings.security.requireTwoFactor ? '2FA Required' : '2FA Optional'} 
                  color={settings.security.requireTwoFactor ? 'success' : 'default'} 
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default SettingsForm;