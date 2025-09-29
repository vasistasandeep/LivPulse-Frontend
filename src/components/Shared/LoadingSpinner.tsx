import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingSpinnerProps {
  size?: number;
  message?: string;
  color?: 'primary' | 'secondary' | 'inherit';
}

const LoadingSpinner = ({ 
  size = 40, 
  message = 'Loading...', 
  color = 'primary' 
}: LoadingSpinnerProps) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      p={3}
    >
      <CircularProgress size={size} color={color} />
      {message && (
        <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default LoadingSpinner;
