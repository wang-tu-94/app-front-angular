import { inject, computed } from '@angular/core';
import { signalStore, withState, withMethods, withComputed, patchState } from '@ngrx/signals';
import { lastValueFrom } from 'rxjs';
import {CronUpdateRequest, Job, JobRequest} from "./jobs.model";
import {JobsService} from "./jobs.service";
import {JobSchedulerService} from "./job-scheduler.service";

export const JobStore = signalStore(
  { providedIn: 'root' },
  withState({
    jobs: [] as Job[],
    loadedAll: false,          // Flag : a-t-on chargé toute la map ?
    loadedGroups: [] as string[], // Flags : quels groupes ont été chargés ?
    isLoading: false,
    error: null as string | null
  }),

  withComputed((store) => ({
    // 1. Pour la vue globale (MapJobsByGroup)
    jobsByGroupMap: computed(() => {
      const map = new Map<string, Job[]>();
      store.jobs().forEach(job => {
        const list = map.get(job.group) || [];
        map.set(job.group, [...list, job]);
      });
      return map;
    })
  })),

  withMethods((
    store,
    jobsService = inject(JobsService),
    schedulerService = inject(JobSchedulerService)
  ) => {

    // Helper privé : fusionne les jobs sans créer de doublons (basé sur group + name)
    const upsertJobs = (current: Job[], incoming: Job[]): Job[] => {
      const map = new Map(current.map(j => [`${j.group}-${j.name}`, j]));
      incoming.forEach(j => map.set(`${j.group}-${j.name}`, j));
      return Array.from(map.values());
    };

    return {
      // --- LECTURE SYNCHRONE (Pour les composants) ---

      // 2. Pour la vue (AllJobsForOneGroup)
      getJobsForGroup(group: string) {
        return store.jobs().filter(j => j.group === group);
      },

      // 3. Pour la vue (JobDetail)
      getJob(group: string, name: string) {
        return store.jobs().find(j => j.group === group && j.name === name);
      },


      // --- FETCHING & CACHE (Les déclencheurs) ---

      async loadAll() {
        if (store.loadedAll()) return; // Cache hit complet

        patchState(store, { isLoading: true, error: null });
        try {
          const groupedData = await lastValueFrom(jobsService.getAllJobs());
          // Transformation de l'objet { "GRP": [...] } en tableau plat [...]
          const flatJobs = Object.values(groupedData).flat();

          patchState(store, { jobs: flatJobs, loadedAll: true, isLoading: false });
        } catch (e) {
          patchState(store, { error: 'Erreur lors du chargement de tous les jobs', isLoading: false });
        }
      },

      async loadGroup(group: string) {
        // Cache hit si on a déjà tout chargé, ou si on a déjà chargé ce groupe
        if (store.loadedAll() || store.loadedGroups().includes(group)) return;

        patchState(store, { isLoading: true, error: null });
        try {
          const groupJobs = await lastValueFrom(jobsService.getJobsByGroup(group));
          patchState(store, (state) => ({
            jobs: upsertJobs(state.jobs, groupJobs),
            loadedGroups: [...state.loadedGroups, group],
            isLoading: false
          }));
        } catch (e) {
          patchState(store, { error: `Erreur lors du chargement du groupe ${group}`, isLoading: false });
        }
      },

      async loadOne(group: string, name: string) {
        // Cache hit si le job est déjà dans le state
        if (store.jobs().some(j => j.group === group && j.name === name)) return;

        patchState(store, { isLoading: true, error: null });
        try {
          const job = await lastValueFrom(jobsService.getJob(group, name));
          patchState(store, (state) => ({
            jobs: upsertJobs(state.jobs, [job]),
            isLoading: false
          }));
        } catch (e) {
          patchState(store, { error: `Erreur lors du chargement du job ${name}`, isLoading: false });
        }
      },

      // --- ACTIONS ET MUTATIONS OPTIMISTES ---

      async schedule(request: JobRequest) {
        await lastValueFrom(schedulerService.schedule(request));
        // L'API renvoie void. On force le chargement du nouveau job pour mettre à jour le state.
        const newJob = await lastValueFrom(jobsService.getJob(request.group, request.name));
        patchState(store, (state) => ({
          jobs: upsertJobs(state.jobs, [newJob])
        }));
      },

      async deleteJob(group: string, name: string) {
        await lastValueFrom(jobsService.deleteJob(group, name));
        patchState(store, (state) => ({
          jobs: state.jobs.filter(j => !(j.group === group && j.name === name))
        }));
      },

      async pauseJob(group: string, name: string) {
        await lastValueFrom(schedulerService.pauseSchedule(group, name));
        patchState(store, (state) => ({
          jobs: state.jobs.map(j => (j.group === group && j.name === name) ? { ...j, status: 'PAUSED' } : j)
        }));
      },

      async resumeJob(group: string, name: string) {
        await lastValueFrom(schedulerService.resumeSchedule(group, name));
        patchState(store, (state) => ({
          jobs: state.jobs.map(j => (j.group === group && j.name === name) ? { ...j, status: 'NORMAL' } : j)
        }));
      },

      async updateCron(group: string, name: string, request: CronUpdateRequest) {
        await lastValueFrom(schedulerService.updateCron(group, name, request));
        patchState(store, (state) => ({
          jobs: state.jobs.map(j => (j.group === group && j.name === name) ? { ...j, cronExpression: request.cron } : j)
        }));
      }
    };
  })
);
