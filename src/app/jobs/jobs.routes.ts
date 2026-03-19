import {Routes} from "@angular/router";
import {JobsListComponent} from "./features/jobs-list/jobs-list.component";
import {JobDetailsComponent} from "./features/job-details/job-details.component";
import {JobsByGroupsComponent} from "./features/jobs-by-groups/jobs-by-groups.component";

export const JOBS_ROUTES: Routes = [
  {
    path: "jobs",
    component: JobsByGroupsComponent,
  },
  {
    path: "jobs/groups/:jobGroup",
    component: JobsListComponent,
  },
  {
    path: "jobs/groups/:jobGroup/jobs/:jobName",
    component: JobDetailsComponent,
  },
  { path: "**", redirectTo: "jobs" },
];
