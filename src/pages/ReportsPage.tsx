import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert
} from '@mui/material';
import {
  Download,
  PictureAsPdf,
  Description,
  Schedule
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { dashboardAPI } from '../api/dashboardAPI';
import toast from 'react-hot-toast';

const ReportsPage: React.FC = () => {
  const { isExecutive } = useAuth();
  const [reportType, setReportType] = useState('executive');
  const [format, setFormat] = useState('pdf');
  const [loading, setLoading] = useState(false);

  const handleDownloadReport = async (type: string, format: string) => {
    setLoading(true);
    try {
      let response;
      switch (type) {
        case 'executive':
          response = await dashboardAPI.getExecutiveReport(format as 'json' | 'pdf');
          break;
        case 'technical':
          response = await dashboardAPI.getTechnicalReport(format as 'json' | 'pdf');
          break;
        case 'weekly':
          response = await dashboardAPI.getWeeklyReport(format as 'json' | 'pdf');
          break;
        default:
          throw new Error('Invalid report type');
      }

      if (format === 'pdf') {
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${type}-report-${new Date().toISOString().split('T')[0]}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
        toast.success('Report downloaded successfully!');
      } else {
        // Handle JSON format
        const jsonStr = JSON.stringify(response.data, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${type}-report-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        window.URL.revokeObjectURL(url);
        toast.success('Report data downloaded successfully!');
      }
    } catch (error) {
      console.error('Report download failed:', error);
      toast.error('Failed to download report');
    } finally {
      setLoading(false);
    }
  };

  const reportTypes = [
    {
      id: 'executive',
      title: 'Executive Report',
      description: 'High-level summary for leadership with key metrics and insights',
      icon: <Description />,
      restricted: false
    },
    {
      id: 'technical',
      title: 'Technical Report',
      description: 'Detailed technical metrics for engineering teams',
      icon: <PictureAsPdf />,
      restricted: false
    },
    {
      id: 'weekly',
      title: 'Weekly Summary',
      description: 'Weekly program summary with trends and highlights',
      icon: <Schedule />,
      restricted: false
    }
  ];

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Reports & Analytics
      </Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom>
        Generate and download comprehensive reports for different stakeholders.
      </Typography>

      {/* Report Generation */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Generate Report
          </Typography>
          
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Report Type</InputLabel>
                <Select
                  value={reportType}
                  label="Report Type"
                  onChange={(e) => setReportType(e.target.value)}
                >
                  <MenuItem value="executive">Executive Report</MenuItem>
                  <MenuItem value="technical">Technical Report</MenuItem>
                  <MenuItem value="weekly">Weekly Summary</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Format</InputLabel>
                <Select
                  value={format}
                  label="Format"
                  onChange={(e) => setFormat(e.target.value)}
                >
                  <MenuItem value="pdf">PDF</MenuItem>
                  <MenuItem value="json">JSON Data</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Button
                variant="contained"
                startIcon={<Download />}
                fullWidth
                size="large"
                onClick={() => handleDownloadReport(reportType, format)}
                disabled={loading}
              >
                {loading ? 'Generating...' : 'Download Report'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Available Reports */}
      <Typography variant="h5" gutterBottom>
        Available Reports
      </Typography>
      
      <Grid container spacing={3}>
        {reportTypes.map((report) => (
          <Grid item xs={12} md={4} key={report.id}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  {report.icon}
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    {report.title}
                  </Typography>
                  {report.restricted && !isExecutive && (
                    <Chip label="Executive Only" color="error" size="small" sx={{ ml: 1 }} />
                  )}
                </Box>
                
                <Typography variant="body2" color="textSecondary" mb={3}>
                  {report.description}
                </Typography>
                
                <Box display="flex" gap={1}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<PictureAsPdf />}
                    onClick={() => handleDownloadReport(report.id, 'pdf')}
                    disabled={loading || (report.restricted && !isExecutive)}
                  >
                    PDF
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Description />}
                    onClick={() => handleDownloadReport(report.id, 'json')}
                    disabled={loading || (report.restricted && !isExecutive)}
                  >
                    Data
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Report Schedule */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Automated Reports
          </Typography>
          
          <Alert severity="info" sx={{ mb: 2 }}>
            Automated report generation is configured to run weekly on Mondays at 9:00 AM.
          </Alert>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Executive Weekly Report
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Automatically generated every Monday and sent to executive team
              </Typography>
              <Chip label="Active" color="success" size="small" sx={{ mt: 1 }} />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Technical Monthly Report
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Comprehensive technical report generated monthly for engineering teams
              </Typography>
              <Chip label="Active" color="success" size="small" sx={{ mt: 1 }} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Report History */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recent Reports
          </Typography>
          
          <Box>
            {[
              { name: 'Executive Report - Week 38', date: '2024-09-23', type: 'Executive', size: '2.4 MB' },
              { name: 'Technical Report - September', date: '2024-09-20', type: 'Technical', size: '5.1 MB' },
              { name: 'Weekly Summary - Week 37', date: '2024-09-16', type: 'Weekly', size: '1.8 MB' },
            ].map((report, index) => (
              <Box
                key={index}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                py={1}
                borderBottom={index < 2 ? '1px solid' : 'none'}
                borderColor="divider"
              >
                <Box>
                  <Typography variant="body2" fontWeight="bold">
                    {report.name}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Generated on {report.date} • {report.size}
                  </Typography>
                </Box>
                <Box>
                  <Chip label={report.type} size="small" />
                  <Button size="small" sx={{ ml: 1 }}>
                    Download
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ReportsPage;
