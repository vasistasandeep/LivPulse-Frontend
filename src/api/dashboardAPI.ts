import apiClient from './client';

export const dashboardAPI = {
  // Dashboard overview
  getOverview: () =>
    apiClient.get('/dashboard/overview'),

  // KPIs
  getKPIs: () =>
    apiClient.get('/dashboard/kpis'),

  // Alerts
  getAlerts: () =>
    apiClient.get('/dashboard/alerts'),

  // Health status
  getHealth: () =>
    apiClient.get('/dashboard/health'),

  // Trends
  getTrends: (days?: number) =>
    apiClient.get('/dashboard/trends', { params: { days } }),

  // Publishing APIs
  getPublishingMetrics: () =>
    apiClient.get('/publishing/metrics'),

  getPublishingKPIs: () =>
    apiClient.get('/publishing/kpis'),

  getPublishingComparison: () =>
    apiClient.get('/publishing/comparison'),

  getPublishingTrends: (contentType: string, days?: number) =>
    apiClient.get(`/publishing/trends/${contentType}`, { params: { days } }),

  getPublishingStats: (contentType: string) =>
    apiClient.get(`/publishing/stats/${contentType}`),

  getContentDeliveryStatus: () =>
    apiClient.get('/publishing/delivery-status'),

  getDRMStatus: () =>
    apiClient.get('/publishing/drm-status'),

  getSubtitleTracks: () =>
    apiClient.get('/publishing/subtitle-tracks'),

  getEncodingProfiles: () =>
    apiClient.get('/publishing/encoding-profiles'),

  // Platform APIs
  getPlatformMetrics: () =>
    apiClient.get('/platform/metrics'),

  getPlatformMetricsByName: (platform: string) =>
    apiClient.get(`/platform/metrics/${platform}`),

  getPlatformTrends: (platform: string, days?: number) =>
    apiClient.get(`/platform/trends/${platform}`, { params: { days } }),

  getPlatformComparison: () =>
    apiClient.get('/platform/comparison'),

  getPlatformAlerts: () =>
    apiClient.get('/platform/alerts'),

  getPlatformKPIs: () =>
    apiClient.get('/platform/kpis'),

  // Backend APIs
  getBackendMetrics: () =>
    apiClient.get('/backend/metrics'),

  getBackendMetricsByService: (service: string) =>
    apiClient.get(`/backend/metrics/${service}`),

  getBackendTrends: (service: string, days?: number) =>
    apiClient.get(`/backend/trends/${service}`, { params: { days } }),

  getBackendAlerts: () =>
    apiClient.get('/backend/alerts'),

  getBackendKPIs: () =>
    apiClient.get('/backend/kpis'),

  getBackendDependencies: () =>
    apiClient.get('/backend/dependencies'),

  // Operations APIs
  getOpsMetrics: () =>
    apiClient.get('/ops/metrics'),

  getCDNMetrics: () =>
    apiClient.get('/ops/cdn'),

  getDevOpsMetrics: () =>
    apiClient.get('/ops/devops'),

  getOpsAlerts: () =>
    apiClient.get('/ops/alerts'),

  getOpsKPIs: () =>
    apiClient.get('/ops/kpis'),

  // Store APIs
  getStoreMetrics: () =>
    apiClient.get('/store/metrics'),

  getStoreMetricsByPlatform: (platform: string) =>
    apiClient.get(`/store/metrics/${platform}`),

  getStoreTrends: (platform?: string, days?: number) =>
    apiClient.get('/store/trends', { params: { platform, days } }),

  getStoreAlerts: () =>
    apiClient.get('/store/alerts'),

  getStoreKPIs: () =>
    apiClient.get('/store/kpis'),

  getStoreComparison: () =>
    apiClient.get('/store/comparison'),

  // CMS APIs
  getCMSMetrics: () =>
    apiClient.get('/cms/metrics'),

  getCMSMetricsByModule: (module: string) =>
    apiClient.get(`/cms/metrics/${module}`),

  getCMSTrends: (module?: string, days?: number) =>
    apiClient.get('/cms/trends', { params: { module, days } }),

  getCMSAlerts: () =>
    apiClient.get('/cms/alerts'),

  getCMSKPIs: () =>
    apiClient.get('/cms/kpis'),

  getCMSProcessingStats: () =>
    apiClient.get('/cms/processing'),

  // Reports APIs
  getExecutiveReport: (format: 'json' | 'pdf' = 'json') =>
    apiClient.get('/reports/executive', { 
      params: { format },
      responseType: format === 'pdf' ? 'blob' : 'json'
    }),

  getTechnicalReport: (format: 'json' | 'pdf' = 'json') =>
    apiClient.get('/reports/technical', { 
      params: { format },
      responseType: format === 'pdf' ? 'blob' : 'json'
    }),

  getWeeklyReport: (format: 'json' | 'pdf' = 'json') =>
    apiClient.get('/reports/weekly', { 
      params: { format },
      responseType: format === 'pdf' ? 'blob' : 'json'
    }),

  generateCustomReport: (config: any) =>
    apiClient.post('/reports/custom', config),

  // Admin APIs for data input
  updatePublishingData: (data: any) =>
    apiClient.post('/admin/publishing-data', data),

  updateDashboardData: (data: any) =>
    apiClient.post('/admin/dashboard-data', data),

  updatePlatformData: (data: any) =>
    apiClient.post('/admin/platform-data', data),

  updateUserData: (data: any) =>
    apiClient.post('/admin/user-data', data),

  updateSettings: (settings: any) =>
    apiClient.post('/admin/settings', settings),

  getSettings: () =>
    apiClient.get('/admin/settings'),
};
