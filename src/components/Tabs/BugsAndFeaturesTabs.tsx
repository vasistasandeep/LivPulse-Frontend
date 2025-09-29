import React, { useState } from 'react';
import { Tabs, Tab, Box, Typography, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import BugReportIcon from '@mui/icons-material/BugReport';
import SprintIcon from '@mui/icons-material/DirectionsRun';
import ProgramIcon from '@mui/icons-material/AccountTree';
import LoadingSpinner from '../Shared/LoadingSpinner';
import { BugsOverview } from './BugsOverview';
import { SprintFeatures } from './SprintFeatures';
import { ProgramDetails } from './ProgramDetails';

// Styled components
const TabPanel = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  '& .MuiTab-root': {
    minWidth: 120,
    fontWeight: theme.typography.fontWeightMedium,
  },
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <TabPanel
      role="tabpanel"
      hidden={value !== index}
      id={`bugs-features-tabpanel-${index}`}
      aria-labelledby={`bugs-features-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </TabPanel>
  );
}

export const BugsAndFeaturesTabs: React.FC = () => {
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Paper elevation={2}>
      <Box sx={{ width: '100%' }}>
        <StyledTabs
          value={value}
          onChange={handleChange}
          aria-label="bugs and features tabs"
        >
          <Tab 
            icon={<BugReportIcon />}
            iconPosition="start"
            label="Bugs & Aging" 
            id="bugs-features-tab-0"
          />
          <Tab 
            icon={<SprintIcon />}
            iconPosition="start"
            label="Sprint Features" 
            id="bugs-features-tab-1"
          />
          <Tab 
            icon={<ProgramIcon />}
            iconPosition="start"
            label="Program Details" 
            id="bugs-features-tab-2"
          />
        </StyledTabs>

        {loading ? (
          <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
            <LoadingSpinner />
          </Box>
        ) : (
          <>
            <CustomTabPanel value={value} index={0}>
              <BugsOverview />
            </CustomTabPanel>

            <CustomTabPanel value={value} index={1}>
              <SprintFeatures />
            </CustomTabPanel>

            <CustomTabPanel value={value} index={2}>
              <ProgramDetails />
            </CustomTabPanel>
          </>
        )}
      </Box>
    </Paper>
  );
};