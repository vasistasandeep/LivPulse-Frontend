import React from 'react';
import { Box, Typography } from '@mui/material';
import PlatformTab from '../components/Tabs/PlatformTab';

const PlatformPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Platform Analytics
      </Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom>
        Detailed analytics for Android, iOS, Web, ATV, and Smart TV platforms.
      </Typography>
      <PlatformTab />
    </Box>
  );
};

export default PlatformPage;
