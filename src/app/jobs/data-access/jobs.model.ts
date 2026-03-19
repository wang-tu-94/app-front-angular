export interface JobLog {
  id: number;
  jobName: string;
  timestamp: number;
  stepName: string;
  status: string;
  message: string;
}

export interface JobRequest {
  name: string;
  group: string;
  cron: string;
  jobType: string;
}

export interface CronUpdateRequest {
  cron: string;
}

export type JobGrouped = Record<string, Job[]>;

export interface Job {
  name: string;
  group: string;
  description: string;
  cronExpression: string;
  status: string;
  nextFireTime: number;
}

export interface JobType {
  id: string
  name: string
  description: string
}
