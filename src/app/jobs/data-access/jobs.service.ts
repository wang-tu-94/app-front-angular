import {inject, Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {SpringPage} from "../../shared/data-access/page.model";
import {JobLog, Job, JobType, JobGrouped} from "./jobs.model";

@Injectable({providedIn: 'root'})
export class JobsService {
  private readonly http = inject(HttpClient);
  private readonly path = "/api/ms-jobs/v1/jobs";
  private readonly API_URL = environment.apiUrl;

  getAllJobs() {
    return this.http.get<JobGrouped>(`${this.API_URL}${this.path}`);
  }

  getJobsByGroup(jobGroup: string){
    return this.http.get<Job[]>(`${this.API_URL}${this.path}/groups/${jobGroup}`);
  }

  getJob(jobGroup: string, jobName: string){
    return this.http.get<Job>(`${this.API_URL}${this.path}/groups/${jobGroup}/jobs/${jobName}`);
  }

  deleteJob(jobGroup: string, jobName: string) {
    return this.http.delete<void>(`${this.API_URL}${this.path}/groups/${jobGroup}/jobs/${jobName}`);
  }

  getAvailableJobTypes() {
    return this.http.get<JobType[]>(`${this.API_URL}${this.path}/jobs/types`);
  }
}
