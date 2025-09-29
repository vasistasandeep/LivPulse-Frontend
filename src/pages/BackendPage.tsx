import React from 'react';
import { Box, Typography } from '@mui/material';
import BackendServicesTab from '../components/Tabs/BackendServicesTab';

const BackendPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Backend Services
      </Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom>
        Monitor and analyze UMSPS, Listing, Playback, AppConfig, CW, and USM services.
      </Typography>
      <BackendServicesTab />
    </Box>
  );
};

export default BackendPage;
