import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  InfoOutlined
} from '@mui/icons-material';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    direction: 'up' | 'down' | 'flat';
    value: number;
    label?: string;
  };
  status?: 'healthy' | 'warning' | 'critical';
  icon?: React.ReactNode;
  onClick?: () => void;
  info?: string;
}

const MetricCard = ({
  title,
  value,
  subtitle,
  trend,
  status,
  icon,
  onClick,
  info
}: MetricCardProps) => {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'healthy':
        return '#4caf50';
      case 'warning':
        return '#ff9800';
      case 'critical':
        return '#f44336';
      default:
        return '#2196f3';
    }
  };

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'up':
        return <TrendingUp sx={{ color: '#4caf50' }} />;
      case 'down':
        return <TrendingDown sx={{ color: '#f44336' }} />;
      default:
        return <TrendingFlat sx={{ color: '#757575' }} />;
    }
  };

  return (
    <Card
      className="metric-card"
      sx={{
        cursor: onClick ? 'pointer' : 'default',
        borderLeft: `4px solid ${getStatusColor(status)}`,
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
      onClick={onClick}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
          <Typography variant="body2" color="textSecondary" component="div">
            {title}
          </Typography>
          <Box display="flex" alignItems="center">
            {icon && <Box mr={1}>{icon}</Box>}
            {info && (
              <Tooltip title={info}>
                <IconButton size="small">
                  <InfoOutlined fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>

        <Typography variant="h4" component="div" fontWeight="bold" mb={1}>
          {value}
        </Typography>

        {subtitle && (
          <Typography variant="body2" color="textSecondary" mb={1}>
            {subtitle}
          </Typography>
        )}

        {trend && (
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center">
              {getTrendIcon(trend.direction)}
              <Typography
                variant="body2"
                sx={{
                  ml: 0.5,
                  color: trend.direction === 'up' ? '#4caf50' : 
                         trend.direction === 'down' ? '#f44336' : '#757575'
                }}
              >
                {trend.value > 0 ? '+' : ''}{trend.value}%
              </Typography>
            </Box>
            {trend.label && (
              <Typography variant="caption" color="textSecondary">
                {trend.label}
              </Typography>
            )}
          </Box>
        )}

        {status && (
          <Box mt={1}>
            <Chip
              label={status.toUpperCase()}
              size="small"
              sx={{
                backgroundColor: `${getStatusColor(status)}20`,
                color: getStatusColor(status),
                fontWeight: 'bold',
                fontSize: '0.7rem'
              }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;
