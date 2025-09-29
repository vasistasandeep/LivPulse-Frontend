export interface Bug {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  platform: 'Android' | 'iOS' | 'Web' | 'TV' | 'Common';
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  assignedTo?: string;
  program: string;
  sprint?: string;
  labels: string[];
  severity: 'critical' | 'major' | 'minor' | 'trivial';
  impactedUsers: number;
  timeToResolve?: number; // in hours
  regression: boolean;
  relatedFeatures: string[];
}

export interface BugSummary {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  closed: number;
  byPriority: {
    high: number;
    medium: number;
    low: number;
  };
  byPlatform: {
    Android: number;
    iOS: number;
    Web: number;
    TV: number;
    Common: number;
  };
  bySeverity: {
    critical: number;
    major: number;
    minor: number;
    trivial: number;
  };
  aging: {
    lessThan7Days: number;
    between7And14Days: number;
    between15And30Days: number;
    moreThan30Days: number;
  };
  averageTimeToResolve: number; // in hours
  regressionRate: number; // percentage
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  platform: 'Android' | 'iOS' | 'Web' | 'TV' | 'Common';
  status: 'planned' | 'in-development' | 'testing' | 'released';
  priority: 'high' | 'medium' | 'low';
  sprint: string;
  program: string;
  startDate: string;
  targetDate: string;
  completionDate?: string;
  progress: number;
  assignedTo: string[];
  dependencies: string[];
  risks: Array<{
    description: string;
    impact: 'high' | 'medium' | 'low';
    mitigation: string;
  }>;
  metrics: {
    developmentEffort: number; // in story points
    testingEffort: number;
    complexity: 'high' | 'medium' | 'low';
  };
}

export interface SprintSummary {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'planned' | 'active' | 'completed';
  progress: number;
  features: {
    total: number;
    completed: number;
    inProgress: number;
    blocked: number;
  };
  bugs: {
    opened: number;
    resolved: number;
    carried: number;
  };
  byPlatform: {
    [key: string]: {
      features: number;
      bugs: number;
      progress: number;
    };
  };
  risks: Array<{
    description: string;
    impact: string;
    status: string;
  }>;
}

export interface ProgramMetrics {
  id: string;
  name: string;
  health: {
    overall: number;
    technical: number;
    business: number;
  };
  features: {
    total: number;
    completed: number;
    inProgress: number;
    planned: number;
    byPlatform: {
      [key: string]: number;
    };
  };
  bugs: {
    total: number;
    open: number;
    resolved: number;
    byPriority: {
      [key: string]: number;
    };
    byPlatform: {
      [key: string]: number;
    };
  };
  performance: {
    velocity: number;
    predictability: number;
    quality: number;
    timeToMarket: number;
  };
  risks: Array<{
    category: string;
    probability: number;
    impact: number;
    status: string;
    mitigation: string;
  }>;
  timeline: {
    startDate: string;
    targetDate: string;
    progress: number;
    milestones: Array<{
      name: string;
      date: string;
      status: string;
    }>;
  };
}