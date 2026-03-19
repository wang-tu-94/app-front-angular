import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {CronUpdateRequest, JobRequest, Job} from "./jobs.model";

@Injectable({providedIn: 'root'})
export class JobSchedulerService {
  private readonly http = inject(HttpClient);
  private readonly path = "/api/ms-jobs/v1/jobs/scheduler";
  private readonly API_URL = environment.apiUrl;

  public schedule(jobRequest: JobRequest) {
    return this.http.post<void>(`${this.API_URL}${this.path}/schedule`, jobRequest)
  }

  public pauseSchedule(jobGroup: string, jobName: string) {
    return this.http.post<void>(`${this.API_URL}${this.path}/${jobGroup}/${jobName}/pause`, {})
  }

  public resumeSchedule(jobGroup: string, jobName: string) {
    return this.http.post<void>(`${this.API_URL}${this.path}/${jobGroup}/${jobName}/resume`, {})
  }

  public updateCron(jobGroup: string, jobName: string, cronUpdateRequest: CronUpdateRequest) {
    return this.http.patch<void>(`${this.API_URL}${this.path}/${jobGroup}/${jobName}/cron`, cronUpdateRequest)
  }
}
