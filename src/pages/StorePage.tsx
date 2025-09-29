import React from 'react';
import { Box, Typography } from '@mui/material';
import StoreTab from '../components/Tabs/StoreTab';

const StorePage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Digital Storefront
      </Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom>
        Analyze e-commerce performance across Web, Mobile, TV, and Partner stores.
      </Typography>
      <StoreTab />
    </Box>
  );
};

export default StorePage;
