import { AxiosResponse } from 'axios';
import client from './client';
import {
  Bug,
  BugSummary,
  Feature,
  SprintSummary,
  ProgramMetrics
} from '../types/bugsAndFeatures';

export const bugsAndFeaturesAPI = {
  // Bugs
  getBugs: (): Promise<AxiosResponse<Bug[]>> =>
    client.get('/api/bugs'),

  getBugById: (id: string): Promise<AxiosResponse<Bug>> =>
    client.get(`/api/bugs/${id}`),

  getBugsSummary: (): Promise<AxiosResponse<BugSummary>> =>
    client.get('/api/bugs/summary'),

  createBug: (bug: Omit<Bug, 'id'>): Promise<AxiosResponse<Bug>> =>
    client.post('/api/bugs', bug),

  updateBug: (id: string, bug: Partial<Bug>): Promise<AxiosResponse<Bug>> =>
    client.put(`/api/bugs/${id}`, bug),

  deleteBug: (id: string): Promise<AxiosResponse<void>> =>
    client.delete(`/api/bugs/${id}`),

  // Features
  getFeatures: (): Promise<AxiosResponse<Feature[]>> =>
    client.get('/api/features'),

  getFeatureById: (id: string): Promise<AxiosResponse<Feature>> =>
    client.get(`/api/features/${id}`),

  createFeature: (feature: Omit<Feature, 'id'>): Promise<AxiosResponse<Feature>> =>
    client.post('/api/features', feature),

  updateFeature: (
    id: string,
    feature: Partial<Feature>
  ): Promise<AxiosResponse<Feature>> =>
    client.put(`/api/features/${id}`, feature),

  deleteFeature: (id: string): Promise<AxiosResponse<void>> =>
    client.delete(`/api/features/${id}`),

  // Sprints
  getSprintSummary: (sprintId: string): Promise<AxiosResponse<SprintSummary>> =>
    client.get(`/api/sprints/${sprintId}/summary`),

  getCurrentSprintSummary: (): Promise<AxiosResponse<SprintSummary>> =>
    client.get('/api/sprints/current/summary'),

  // Program Metrics
  getProgramMetrics: (programId: string): Promise<AxiosResponse<ProgramMetrics>> =>
    client.get(`/api/programs/${programId}/metrics`),

  // Analytics and Reports
  getBugsTrends: (params: {
    startDate: string;
    endDate: string;
    platform?: string;
  }): Promise<AxiosResponse<any>> =>
    client.get('/api/analytics/bugs/trends', { params }),

  getFeatureProgress: (params: {
    startDate: string;
    endDate: string;
    platform?: string;
  }): Promise<AxiosResponse<any>> =>
    client.get('/api/analytics/features/progress', { params }),

  generateBugsReport: (params: {
    startDate: string;
    endDate: string;
    format: 'pdf' | 'excel';
  }): Promise<AxiosResponse<Blob>> =>
    client.get('/api/reports/bugs', {
      params,
      responseType: 'blob'
    }),

  generateFeaturesReport: (params: {
    startDate: string;
    endDate: string;
    format: 'pdf' | 'excel';
  }): Promise<AxiosResponse<Blob>> =>
    client.get('/api/reports/features', {
      params,
      responseType: 'blob'
    })
};