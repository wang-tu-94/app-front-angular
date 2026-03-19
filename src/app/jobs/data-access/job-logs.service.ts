import {inject, Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {MobilePage, MobilePageFilter} from "../../cms/data-access/mobile-pages.model";
import {SpringPage} from "../../shared/data-access/page.model";
import {finalize} from "rxjs";
import {JobLog} from "./jobs.model";

@Injectable({providedIn: 'root'})
export class JobLogsService {
  private readonly http = inject(HttpClient);
  private readonly path = "/api/ms-jobs/v1/logs";
  private readonly API_URL = environment.apiUrl;

  getLogs(jobName: string, page: number = 0, size: number = 10){
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<SpringPage<JobLog>>(`${this.API_URL}${this.path}/${jobName}`, { params });
  }

  getLogById(jobName: string, jobLogId: number){
    return this.http.get<JobLog>(`${this.API_URL}${this.path}/${jobName}/${jobLogId}`)
  }

  deleteLogs(jobName: string) {
    return this.http.delete<void>(`${this.API_URL}${this.path}/${jobName}`)
  }
}
