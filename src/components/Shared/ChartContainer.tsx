import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

interface ChartContainerProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  height?: number;
  type?: string;
  data?: any[];
  dataKey?: string;
  xAxisKey?: string;
  colors?: string[];
}

const ChartContainer = ({
  title,
  subtitle,
  children,
  height = 300,
  type,
  data = []
}: ChartContainerProps) => {
  return (
    <Card>
      <CardContent>
        <Box mb={2}>
          <Typography variant="h6" component="div" gutterBottom>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="textSecondary">
              {subtitle}
            </Typography>
          )}
          {type && data && (
            <Typography variant="body2" color="textSecondary">
              📊 {type.toUpperCase()} Chart - {data.length} data points
            </Typography>
          )}
        </Box>
        <Box 
          height={height} 
          display="flex" 
          alignItems="center" 
          justifyContent="center"
        >
          {children}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ChartContainer;
