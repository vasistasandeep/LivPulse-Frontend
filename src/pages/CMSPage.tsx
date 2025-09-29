import React from 'react';
import { Box, Typography } from '@mui/material';
import CMSTab from '../components/Tabs/CMSTab';

const CMSPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Content Management System
      </Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom>
        Monitor Blitz CMS performance, asset pipeline, and content workflows.
      </Typography>
      <CMSTab />
    </Box>
  );
};

export default CMSPage;
