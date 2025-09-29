import React from 'react';
import { Box, Typography } from '@mui/material';
import OpsCDNTab from '../components/Tabs/OpsCDNTab';

const OperationsPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Operations & Infrastructure
      </Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom>
        Monitor CDN performance, infrastructure health, DevOps metrics, and security.
      </Typography>
      <OpsCDNTab />
    </Box>
  );
};

export default OperationsPage;
